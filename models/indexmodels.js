const db = require('./connection')
const { request } = require('express')

function indexModel()
{
  this.register=(userdetails)=>{
    return new Promise((resolve,reject)=>{
      db.collection('register').find().toArray((err,data)=>{
        if(err){
          reject(err)
        }
        else{
          if(data.length==0){
            userdetails._id=1;
          }
          else {
            var max_id = data[0]._id
            for(let row of data){
              if(max_id<row._id){
                max_id=row._id
              }
              userdetails._id=max_id+1;
            }
          }
          var userstatus=0;
          for(row of data){
            if(userdetails.email==row.email){
              userstatus=1;
              resolve({"msg":"Record already exists"})
            }
          }
          userdetails.status=0
          userdetails.role='user';
          userdetails.info=Date();
              if(userstatus==0){
                db.collection('register').insert(userdetails,(err)=>{
                  if(err){
                    reject(err)
                  }
                  else{
                    resolve({"msg":"Record inserted successfully"})
                  }
                })
              }
        }
      })
    })
  }
this.login=(userdetails)=>{
  return new Promise((resolve,reject)=>{
    db.collection('register').find({'email':userdetails.email,'password':userdetails.password}).toArray((err,data)=>{
      if(err){
        reject(err)
      }
      else{
        resolve(data,{"msg":"Login Successfully"})
      }
    })
  })
}

this.fetchAll=(collection_name)=>{
  return new Promise((resolve,reject)=>{
    db.collection(collection_name).find().toArray((err,data)=>{
      if(err){
        reject(err)
      }
      else{
        resolve(data)
      }
    })
  })
}

this.viewsubcategory=(catnm)=>{
  return new Promise((resolve,reject)=>{
    db.collection('subcategory').find({'catnm':catnm}).toArray((err,data)=>{
      if(err){
        reject(err)
      }
      else{
        resolve(data)
      }
    })
  })
}

this.verifyuser=(emailid)=>{
  return new Promise((resolve,reject)=>{
    db.collection('register').update({'email':emailid},{$set :{'status':1}},(err)=>{
      if(err){
        reject(err)
      }
      else{
        resolve(true)
      }
    })
  })
}

this.resetpassword=(userdetails)=>{
  return new Promise((resolve,reset)=>{
    db.collection('register').find({'email':userdetails.email}).toArray((err,data)=>{
      if(err){
        console.log(err)
      }
      else{
        resolve(true)
      }
    })
  })
}

this.reset=(getpassword)=>{
  return new Promise((resolve,reject)=>{
    db.collection('register').find({'email':getpassword.email}).toArray((err,data)=>{
      if(err){
        reject(err)
      }
      else{
        if(data.length!=0){
          db.collection('register').update({_id:parseInt(data[0]._id)},{$set :{'password':getpassword.password}},(err)=>{
            if(err){
              console.log(err)
            }
            else{
              resolve(true)
            }
          })
        }
      }
    })
  })
}
}
module.exports= new indexModel
