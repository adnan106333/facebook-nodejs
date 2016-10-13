
var FB              = require('fb'),

    config          = require('../config');

var MongoClient     = require('mongodb').MongoClient;
var assert          = require('assert');
var ObjectId        = require('mongodb').ObjectID;
var dbUrl = 'mongodb://localhost:27017/test';
//var dbUrl = 'mongodb://testuser:testuser@ds053176.mlab.com:53176/nservices_test';

exports.search = function (req, res) {
    var parameters              = req.query;
    parameters.access_token     = req.session.access_token;
    FB.api('/search', req.query, function (result) {
        if(!result || result.error) {
            return res.send(500, 'error');
        }
        res.send(result);
    });
};

// exports.friends = function (req, res) {
//     FB.api('me/friends', {
//         fields:         'name,picture',
//         limit:          250,
//         access_token:   req.session.access_token
//     }, function (result) {
//         if(!result || result.error) {
//             return res.send(500, 'error');
//         }
//         res.send(result);
//     });
// };

exports.friend=function (req,res) {
    // var appAccessToken=config.facebook.appId +'|'+config.facebook.appSecret;
    FB.api("/me/friends",{
        // fields:['id'],
        data:'name',
        access_token:   req.session.access_token
        // access_token:   appAccessToken
    },function (responce) {
        console.log(responce);
        return res.send(responce);
    })
};

exports.announce = function (req, res) {
    var parameters              = req.body;
    parameters.access_token     = req.session.access_token;
    FB.api('/me/' + config.facebook.appNamespace +':eat', 'post', parameters , function (result) {
        if(!result) {
            return res.send(500, 'error');
        } else if(result.error) {
            if(result.error.type == 'OAuthException') {
                result.redirectUri = FB.getLoginUrl({ scope: 'user_about_me,publish_actions', state: encodeURIComponent(JSON.stringify(parameters)) });
            }
            return res.send(500, result);
        }

        res.send(result);
    });
};

exports.lastName= function (req,res) {
    FB.api('/me',{
        fields:'last_name',
        access_token:   req.session.access_token
    },function (responce) {
        console.log(responce);
        return res.send(responce);
    })
};

exports.aboutMe= function (req,res) {
    FB.api('/me',{
        fields:'id,name,email',
        access_token:   req.session.access_token
    },function (responce) {
        console.log(responce);
        return res.send(responce);
    })
};

/*exports.friendList=function (req,res) {
    FB.api("/me/friends",{
        access_token:   req.session.access_token
    },function (responce) {
        console.log(responce);
        return res.send(responce);
    })
};*/




exports.friendList=function (req,res) {
    FB.api("/me/friendlists",{
        fields:['id','name','list_type'],
        access_token:   req.session.access_token
    },function (responce) {
        console.log(responce);
        return res.send(responce);
    })
};

exports.comment=function (req,res) {
    FB.api('/me/comments',{
        fields:['id','name'],
        access_token: req.session.access_token
    },function (responce) {
        console.log(responce);
        res.send(responce);
    })
};

exports.photo=function (req,res) {

    var appAccessToken=config.facebook.appId +'|'+config.facebook.appSecret;
    FB.api('/photo',{
        access_token:  appAccessToken
    },function (responce) {
        console.log(responce);
        res.send(responce);
    })
};

exports.getUserProfilePicture = function(req,res){
    var appAccessToken=config.facebook.appId +'|'+config.facebook.appSecret;
    FB.api('/me/picture',{
        redirect:false,

        access_token:  req.session.access_token,

    },function (responce) {
        console.log(responce);
        res.send(responce);
    })
};

exports.album=function (req,res) {

    // var appAccessToken=config.facebook.appId +'|'+config.facebook.appSecret;
    var userAccessToken=req.session.access_token;
    FB.api('/me',{
        fields:['albums'],
        access_token:  userAccessToken
    },function (responce) {
        console.log(responce);
        res.send(responce);
    })
};

exports.permissionList=function (req,res) {

    // var appAccessToken=config.facebook.appId +'|'+config.facebook.appSecret;
    var userAccessToken=req.session.access_token;
    FB.api('/me/permissions',{
        access_token:  userAccessToken
    },function (responce) {
        console.log(responce);
        res.send(responce);
    })
};

exports.albumByID=function (req,res) {

    // var appAccessToken=config.facebook.appId +'|'+config.facebook.appSecret;
    var userAccessToken=req.session.access_token;
    FB.api('/me/permissions',{
        access_token:  userAccessToken
    },function (responce) {
        console.log(responce);
        res.send(responce);
    })
};

exports.location=function (req,res) {
    var userAccessToken=req.session.access_token;
    FB.api('/me',{
        fields:['location','locale'],
        access_token:  userAccessToken
    },function (responce) {
        console.log(responce);
        res.send(responce);
    })
};

exports.video=function (req,res) {
    var userAccessToken=req.session.access_token;
    FB.api('/me/videos',{
        type:'uploaded',
        fields:['description','id','title','likes'],
        access_token:  userAccessToken
    },function (responce) {
        console.log(responce);
        if(responce.data!=null && !responce.error){

            MongoClient.connect(dbUrl,function (err,db) {
                assert.equal(null,err);
                insertData(db,'uservideo',responce.data,function () {
                    db.close();
                })
            });
            responce.result='success';
            responce.message='user found';
            res.send(responce);
        }else {
            responce.result='fail';
            responce.message='user not found';
            res.send(responce)
        }

    })
};

exports.videoLikes=function (req,res,next) {
    var appAccessToken=config.facebook.appId +'|'+config.facebook.appSecret;
    // var userAccessToken=req.session.access_token;
    var id=req.body.id;
    FB.api('/'+id+'/likes',{
        access_token: appAccessToken
    },function (responce) {
        if(responce && !responce.error){
            console.log(responce);
            var data=[];
            data.push({'videoID':id,'userData':responce.data});
            console.log(data);
            MongoClient.connect(dbUrl, function(err, db) {
                assert.equal(null, err);
                insertData(db,'videolikes',data, function() {
                    db.close();
                });
            });
            responce.result='success';
            res.send(responce);
        }else {
            responce.result='error';
            res.send(responce);
        }

    })

};

exports.getUserInfoByID=function (req,res) {
    // var appAccessToken=config.facebook.appId +'|'+config.facebook.appSecret;
    var userAccessToken=req.session.access_token;

    FB.api('/344988169169464',{
        fields:['id','name','email','about','age_range','birthday','cover','education','gender','hometown','languages','locale','relationship_status','religion','friends','location'],
        access_token: userAccessToken
    },function (responce) {
        console.log(responce);
        res.send(responce);
    })
};


var dnConnect=function () {

    // var url = 'mongodb://localhost:27017/test';

    MongoClient.connect(dbUrl, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server.");
        // db.close();
    });

};

/// MongoDB insert, update, delete functions
var insertData=function (db,collection,data,callback) {
    db.collection(collection).insertMany(data,function (err,result) {
        assert.equal(err, null);
        console.log("Inserted a document into the restaurants collection.");
        callback();
    })
};






