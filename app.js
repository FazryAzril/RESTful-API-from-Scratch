import  express  from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import mongoose, { get } from "mongoose";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);


//////////////// REQUEST TARGETING ALL ARTICLE/////////////////////////

app.route("/articles")

.get(function (req, res){
    Article.find(function(err, foundArticles){
        if (!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
})

.post(function (req,res){
    console.log();
    console.log();

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function (err){
        if(!err){
            res.send("Succesfully added new article.")
        } else {
            res.send(err);
        }

    });

})

.delete(function (req,res){
    Article.deleteMany(function(err){
        if (!err){
            res.send("Succesfully deleted all articles");
        } else {
            res.send(err);
        }
    });
});


//////////////// REQUEST TARGETING A SPECIFIC ARTICLE/////////////////////////


app.route("/articles/:articleTitle")

.get(function (req,res){

    Article.findOne({ title: req.params.articleTitle}, function(err, foundArticles){
        if(foundArticles) {
            res.send(foundArticles);
        } else {
            res.send("No article found")
        }
    });
})

.put(function(req,res){
    Article.replaceOne(
        {title:req.params.articleTitle},
        {title:req.body.title, content:req.body.content},
        function(err) {
            if(!err){
                res.send("Succesfully updated the arcticles")
            } else {
                res.send("No matching articles to update")
            }
        }
    );
})

.patch(function(req,res){
    Article.updateOne(
        {title:req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err) {
                res.send("Successfully updated")
            } else {
                res.send(err)
            }
        }
    );
})

.delete(function(req,res){
    Article.deleteOne(
        {title:req.params.articleTitle},
        function(err){
            if(!err){
                res.send('Successfully deleted')
            } else {
                res.send(err)
            }
        }
    )
})
 


app.listen(3000, function(){
    console.log("Server started on port 3000");
});