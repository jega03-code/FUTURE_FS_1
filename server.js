const express=require(
"express"
);

const mongoose=require(
"mongoose"
);

const cors=require(
"cors"
);

const Contact=require(
"./models/Contact"
);

const app=express();

app.use(express.json());

app.use(cors());


mongoose.connect(

"mongodb://localhost:27017/portfolioDB"

)

.then(()=>{

console.log(

"Database Connected"

)

});


app.post(

"/contact",

async(req,res)=>{

const data=

new Contact({

name:req.body.name,

email:req.body.email,

message:req.body.message

});

await data.save();

res.json({

message:

"Saved"

})

}

);


app.listen(

3000,

()=>{

console.log(

"Server Running"

)

}
)