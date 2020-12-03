const db=require('./connection')
const { parseConnectionUrl } = require('nodemailer/lib/shared')

function adminModel()
{
  this.fetchUser=()=>{
    return new Promise((resolve,reject)=>{
      db.collection('register').find({'role':'user'}).toArray((err,data)=>{
        if(err){
          reject(err)
        }
        else{
          resolve(data)
        }
      })
    })
  }

  this.manageuserstatus=(statusdetail)=>{
    return new Promise((resolve,reject)=>{
      if(statusdetail.s=='block'){
        db.collection('register').update({_id:parseInt(statusdetail.regid)},{$set :{'status':0}},(err)=>{
          if(err){
            reject(err)
          }
          else{
            resolve()
          }
        })
      }else if(statusdetail.s=='unblock'){
        db.collection('register').update({_id:parseInt(statusdetail.regid)},{$set :{'status':1}},(err)=>{
          if(err){
            reject(err)
          }
          else{
            resolve()
          }
        })
      }
      else{
        db.collection('register').remove({_id:parseInt(statusdetail.regid)},(err)=>{
          if(err){
            reject(err)
          }
          else{
            resolve()
          }
        })
      }
    })
  }

  this.managecategory=(catnm,caticon_nm)=>{
    return new Promise((resolve,reject)=>{
      db.collection('category').find().toArray((err,data)=>{
        if(err){
          reject(err)
        }
        else{
          var cDetails={}
          if(data.length==0){
            cDetails._id=1
          }
          else{
            max_id=data[0]._id
            for(row of data){
              if(max_id<row._id){
                max_id=row._id
              }
              cDetails._id=max_id+1
            }
          }
          var categorycheck=0
          if(data.length!=0){
            for(row of data){
              if(row.catnm==catnm){
                categorycheck=1
                resolve(false)
              }
            }
          }
          if(categorycheck==0){
            cDetails.catnm=catnm
            cDetails.caticon_nm=caticon_nm
            db.collection('category').insert(cDetails,(err)=>{
              if(err){
                reject(err)
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

  this.managesubcategory=(catnm,subcatnm,subcaticon_nm)=>{
    return new Promise((resolve,reject)=>{
      db.collection('subcategory').find().toArray((err,data)=>{
        if(err){
          console.log(err)
        }
        else{
          var scDetails={}
          if(data.length==0){
            scDetails._id=1
          }
          else{
            var max_id=data[0]._id
            for(let row of data){
              if(max_id<row._id){
                max_id=row._id
              }
              scDetails._id=max_id+1
            }
          }
          var subcategorycheck=0
          if(data.length!=0){
            for(let row of data){
              if(row.subcatnm==subcatnm){
                subcategorycheck=1
                resolve(false)
              }
            }
          }
          if(subcategorycheck==0){
            scDetails.catnm=catnm
            scDetails.subcatnm=subcatnm
            scDetails.subcaticon_nm=subcaticon_nm
            db.collection('subcategory').insert(scDetails,(err)=>{
              if(err){
                reject(err)
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

  this.verify=(email,accountverify)=>{
    return new Promise((resolve,reject)=>{
      db.collection('register').find({'email':email,'password':accountverify.cpassword}).toArray((err,data)=>{
        if(err){
          console.log(err)
        }
        else{
          if(data.length!=0){
            db.collection('register').update({'_id':parseInt(data[0]._id)},{$set :{'password':accountverify.npassword }},(err)=>{
              if(err){
                reject(err)
              }
              else{
                resolve(true)
              }
            })
          }
          else{
            resolve(false)
          }
        }
      })
    })
  }
}

module.exports= new adminModel()
