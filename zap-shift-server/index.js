const express = require('express')
const cors=require('cors');
const app = express();
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const stripe = require('stripe')(process.env.STRIPE_SECRET);

const port =process.env.PORT || 3000
const crypto=require("crypto");

const admin = require("firebase-admin");

const  serviceAccount = require("./zap-shift-firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


function generateTrackingId(){
  const prefix="PRCL";
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random=crypto.randomBytes(3).toString("hex").toUpperCase();
  return `${prefix}-${date}-${random}`;
}
//middleware
app.use(express.json());
app.use(cors());

const verifyFBToken=async(req,res,next)=>{
  const token=req.headers.authorization;
  if(!token){
    return res.status(401).send({message:'una access'})
  }
 try{
  const idToken=token.split(' ')[1];
  const decoded=await admin.auth().verifyIdToken(idToken);
  console.log('decoded in the token',decoded);
  req.decoded_email=decoded.email;
  next();
 }catch(err){
return res.status(401).send({message:'una access error'});
 }

}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sumux0b.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const db=client.db('zap_shift_db');
    const userCollection=db.collection('users');
    const parcelsCollection=db.collection('parcels');
    const paymentCollection=db.collection('payments');
    const ridersCollection=db.collection('riders');

    const verifyAdmin=async(req,res,next)=>{
    const email=req.decoded_email;
    const query={email};
    const user=await userCollection.findOne(query);
    if(!user || user.role !=='admin'){
      return res.status(403).send({message:'forbidden access'});
    }
    next();
    }
    //users related apis
    app.get('/users',verifyFBToken,async(req,res)=>{
      const searchText=req.query.searchText;
      const query={};
      if(searchText){
     //   query.displayName={$regex:searchText,$options:'i'}
     query.$or=[
      {displayName:{$regex:searchText,$options:'i'}},
      {email:{$regex:searchText,$options:'i'}},
     ]
      }
      const cursor=userCollection.find(query).sort({createdAt:-1});
      const result=await cursor.toArray();
      res.send(result);
    })
    app.get('/users/:id',async(req,res)=>{

    })
    app.get('/users/:email/role',async(req,res)=>{
      const email=req.params.email;
      const query={email};
      const user=await userCollection.findOne(query);
      res.send({role:user?.role || 'user'});

    })
    app.post('/users',async(req,res)=>{
      const user=req.body;
      user.role='user';
      user.createdAt=new Date();
      const email=user.email;
      const userExists=await userCollection.findOne({email});
      if(userExists){
        return res.send({message:'user exits'});

      }
      const result=await userCollection.insertOne(user);
      res.send(result);
    })
    app.patch('/users/:id/role',verifyFBToken,verifyAdmin,async(req,res)=>{
      const id=req.params.id;
      const roleInfo=req.body;
      const query={_id:new ObjectId(id)};
      const updatedDoc={
        $set:{
          role:roleInfo.role
        }
      }
const result=await userCollection.updateOne(query,updatedDoc)
res.send(result);
    })
    //parcel apis
    app.get('/parcels',async(req,res)=>{
     const query={};
     const {email,deliveryStatus}=req.query;

     if(email){
        query.SenderEmail=email;
     }
if(deliveryStatus){
  query.deliveryStatus=deliveryStatus
}

     const options={sort:{createdAt:-1}}
     const cursor=parcelsCollection.find(query,options);
     const result=await cursor.toArray();
     res.send(result);

    })
    app.get('/parcels/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)}
      const result=await parcelsCollection.findOne(query);
      res.send(result);
    })
    app.post('/parcels',async(req,res)=>{
        const parcel=req.body;
        parcel.createdAt=new Date();
        const result=await parcelsCollection.insertOne(parcel);
        res.send(result);
    })
    
    app.patch('/parcels/:id',async(req,res)=>{
      const {riderId,riderName,riderEmail}=req.body;
      const id=req.params.id;
      const query={_id:new ObjectId(id)}
      const updatedDoc={
        $set:{
    deliveryStatus:'driver-assigned',
    riderId:riderId,
    riderName:riderName,
    riderEmail:riderEmail
        }
      }
      const result=await parcelsCollection.updateOne(query,updatedDoc)
      const riderQuery={_id:new ObjectId(riderId)}
      const riderUpdatedDoc={
        $set:{
          
workStatus:'in_delivery'
        }
      }
      const riderResult=await ridersCollection.updateOne(riderQuery,riderUpdatedDoc);
      res.send(riderResult);
    })

    app.delete('/parcels/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)}
      const result=await parcelsCollection.deleteOne(query);
      res.send(result);
    })
    //PAYMENT RELATED APIS
    app.post('/payment-checkout-session',async(req,res)=>{
      const paymentInfo=req.body;
      const amount=parseInt(paymentInfo.cost)*100;
      const session=await stripe.checkout.sessions.create({
         line_items: [
      {
        // Provide the exact Price ID (for example, price_1234) of the product you want to sell
        price_data:{
          currency:'usd',
          unit_amount:amount,
          product_data:{
            name:`please pay for ${paymentInfo.parcelName}`
          }
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    metadata:{
      parcelId:paymentInfo.parcelId
    },
    customer_email:paymentInfo.SenderEmail,
    success_url: `${process.env.SITE_DOMAIN}/dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.SITE_DOMAIN}/dashboard/payment-cancelled`,
      })
      res.send({url:session.url});
    });
    //old
    app.post('/create-checkout-session',async(req,res)=>{
      const paymentInfo=req.body;
      const amount=parseInt(paymentInfo.cost)*100;
      const session=await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, price_1234) of the product you want to sell
        price_data:{
   currency:'USD',
   unit_amount:amount,
   product_data:{
    name:paymentInfo.parcelName
   }
        },
        quantity: 1,
      },
    ],
    customer_email:paymentInfo.SenderEmail,
    mode: 'payment',
    metadata:{
      parcelId:paymentInfo.parcelId,
      parcelName:paymentInfo.parcelName
    },
    success_url: `${process.env.SITE_DOMAIN}/dashboard/payment-success`,
    cancel_url: `${process.env.SITE_DOMAIN}/dashboard/payment-cancelled`,
  })
  console.log(session);
  res.send({url:session.url})
    })

    app.patch('/payment-success', async (req, res) => {
  try {
    const sessionId = req.query.session_id;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const transactionId = session.payment_intent;

    // ১. ডাটাবেসে চেক করা
    const query = { transactionId: transactionId };
    const paymentExist = await parcelsCollection.findOne(query);
    console.log(paymentExist);
    if (paymentExist) {
      // অবশ্যই 'return' ব্যবহার করবেন যাতে নিচের কোড আর না চলে
      return res.send({ message: 'already exists', transactionId,trackingId:paymentExist.trackingId });
    }

    const trackingId = generateTrackingId();

    if (session.payment_status === 'paid') {
      const id = session.metadata.parcelId;
      const parcelQuery = { _id: new ObjectId(id) };

      // ২. পার্সেল আপডেট করা
      const update = {
        $set: {
          paymentStatus: 'paid',
          deliveryStatus:'pending-pickup',
          transactionId: transactionId, // এটিও সেভ করে রাখা ভালো
          trackingId: trackingId
        }
      };
      const result = await parcelsCollection.updateOne(parcelQuery, update);

      // ৩. পেমেন্ট হিস্ট্রি সেভ করা
      const payment = {
        amount: session.amount_total / 100,
        currency: session.currency,
        customer_email: session.customer_email,
        parcelId: session.metadata.parcelId,
        parcelName: session.metadata.parcelName,
        transactionId: transactionId,
        paymentStatus: session.payment_status,
        paidAt: new Date(),
      };

      const resultPayment = await paymentCollection.insertOne(payment);

      // সফল হলে এখানেই রিটার্ন করুন
      return res.send({
        success: true,
        modifyParcel: result,
        trackingId: trackingId,
        transactionId: transactionId,
        paymentInfo: resultPayment,
        trackingId:trackingId
      });
    }

    // পেমেন্ট ফেইল করলে
    res.send({ success: false, message: 'Payment not successful' });

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});
//payment related apis
app.get('/payments',verifyFBToken,async(req,res)=>{
  const email=req.query.email;
  const query={};
 // console.log('headers',  req.headers);
  if(email){
    query.customer_email=email;
    //check email address
    if(email!==req.decoded_email){
      return res.status(403).send({message:'forbidden access'});
    }
  }
  const cursor=paymentCollection.find(query).sort({paidAt:-1});
  const result=await cursor.toArray();
  res.send(result);
})

//riders related apis
app.get('/riders',async(req,res)=>{

  const {status,district,workStatus}=req.query;
  const query = {};

  if(req.query.status){
    query.status=req.query.status;

  }
  if(district){
    query.district=district
  }
  if(workStatus){
    query.workStatus=workStatus
  }

  const cursor=ridersCollection.find(query);
  const result=await cursor.toArray();
  res.send(result);
})
app.post('/riders',async(req,res)=>{
  const rider=req.body;
  rider.status='pending',
  rider.createdAt=new Date();
  const result=await ridersCollection.insertOne(rider);
  res.send(result);
})
app.patch('/riders/:id',verifyFBToken,verifyAdmin,async(req,res)=>{
  const status=req.body.status;
  const id=req.params.id;
  const query={_id: new ObjectId(id)}
  const updatedDoc={
    $set:{
      status:status,
      workStatus:'available'
    }
  }
  
  const result=await ridersCollection.updateOne(query,updatedDoc);
  if(status==='approved'){
    const email=req.body.email;
    const userQuery={email};
    const updateUser={
      $set:{
        role:'rider'
      }
    }
    const userResult=await userCollection.updateOne(userQuery,updateUser);
  }
  res.send(result);
})
app.delete('/riders/:id',verifyFBToken, async(req,res)=>{
    const id=req.params.id;
    const query={_id:new ObjectId(id)};
    const result=await ridersCollection.deleteOne(query);
    res.send(result);
  })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('ZAP IS SHIFTING SHIFTING')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
