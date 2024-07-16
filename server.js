var express=require('express');
var app=express();
var mysql=require('mysql2');
var cors=require('cors');
var bodyParser=require('body-parser');
var path=require('path');
const { stringify } = require('querystring');
const Swal=require('sweetalert2');
const { title } = require('process');


//json parser
var jsonParser=bodyParser.json();

//url encoded
var urlencodedParser=bodyParser.urlencoded({extended:false});


app.use(jsonParser);
app.use(urlencodedParser);
app.use(cors());

//mysql connection
var con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"pass",
    database:"book_db"
});

con.connect((err)=>{
    if(err) throw err;
    console.log("connected to database");
})

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'/home.html'));
})

//html for book creation
app.get('/create',(req,res)=>{
    res.sendFile(path.join(__dirname,'/index.html'));
});




//get all books

app.get('/books',(req,res)=>{
    con.query("select *from book;",(err,result,fields)=>{
        if(err) throw err;
        else if(result.length==0){
            res.send("<script> alert('No book exist')</script>");
           
            //res.send("<h3>No book exist</h3>")
        }

        else res.send(result);
    })
   

})

app.post('/singledel',jsonParser,(req,res)=>{
    let id=req.body.id;
    //console.log(id);
   // res.send("success")
    res.redirect('/delete/'+id);
});



//get a single book (used to pass id from front end)
app.post('/single',jsonParser,(req,res)=>{
    let id=req.body.id;
    //console.log(id);
    //res.send("success")
    res.redirect('/single/'+id);
});


//get a single book
app.get('/single/:id',jsonParser,(req,res)=>{
   //let id=req.body.id;
   let id=req.params.id;
   //console.log(id);

    con.query(`select *from book where book_title='${id}';` ,(err,result,fields)=>{
        if(err){
             
            throw err;
        }
        else if(result.length==0){
            res.send("<h3>Invalid book name or book doesn't exist</h3>");
            console.log("inavlid book name or book doesn't exist");
        }
            
         else  res.send(result);
        
    })
      

})


//post a new book
app.post('/create',jsonParser,(req,res)=>{
  let book_title=req.body.book_title;
  let description=req.body.description;
  let author_name=req.body.author_name;
  let price=req.body.price;



  let qr=`insert into book (book_title,description,author_name,price) values ('${book_title}','${description}','${author_name}','${price}');`
  con.query(qr,(err,result)=>{
    if(err){
        res.send("<script> alert('Book name should be different')</script>");
        console.log("new book adding is failed")
        
    }
    else{
        res.send("<script> alert('New book added successfully')</script>")
        console.log("New Book added succesfully");
    }
    
  })
 
})

//update a book
app.patch('/book',(req,res)=>{

})
 
//delete a book
app.get('/delete/:id',jsonParser,(req,res)=>{
    let id=req.params.id;
    //console.log(id);
    con.query(`delete from book where book_title='${id}';`,(err,result)=>{
        if(err){   
            throw err;
        }
        else if(result.affectedRows==0){
            res.send("<h3>Invalid book name or book doesn't exist</h3>");
        }
        else  {
            //res.send(result);
            res.send("<script> alert('Book deleted succesfully')</script>");
        }
    })
});


app.listen(8000,()=>{
    console.log("server running");
})