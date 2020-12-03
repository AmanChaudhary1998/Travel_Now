const db = require('./connection')

function userModel()
{
    this.fetchsubcat=(catnm)=>{
        return new Promise((resolve,reject)=>{
            db.collection("subcategory").find({'catnm':catnm}).toArray((err,data)=>{
                if(err){
                    console.log(err)
                }
                else{
                    resolve(data)
                }
            })
        })
    }

    this.fetchlocality=(c)=>{
        return new Promise((resolve,reject)=>{
            db.collection('locality').find({'cityname':c}).toArray((err,data)=>{
                if(err){
                    console.log(err)
                }
                else{
                    resolve(data)
                }
            })
        })
    }

    this.addlocation=(locationDetails,imgDetails1,imgDetails2,imgDetails3,imgDetails4)=>{
        return new Promise((resolve,reject)=>{
            db.collection('addlocation').find().toArray((err,data)=>{
                if(err){
                    console.log(err)
                }
                else{
                    if(data.length==0){
                        locationDetails._id=1
                    }
                    else{
                        var maxid=data[0]._id
                        for(let row of data){
                            if(maxid<row._id){
                                maxid=row._id
                            }
                            locationDetails._id=maxid+1
                        }
                    }
                        locationDetails.img1=imgDetails1
                        locationDetails.img2 = imgDetails2
                        locationDetails.img3=imgDetails3
                        locationDetails.img4=imgDetails4
                        locationDetails.info=Date()
                        locationDetails.status= 0
                        db.collection('addlocation').insert(locationDetails,(err)=>{
                            if(err){
                                reject(err)
                            }
                            else{
                                resolve(true)
                            }
                        })
                }
            })
        })
    }

    this.fetchAll=(collection_name)=>{
        return new Promise((resolve,reject)=>{
            db.collection(collection_name).find({}).toArray((err,data)=>{
                if(err){
                    console.log(err)
                }
                else{
                    resolve(data)
                }
            })
        })
    }

    this.pay=(urlData)=>{
        return new Promise((resolve,reject)=>{
            db.collection('payment').find().toArray((err,data)=>{
                if(err){
                    console.log(err)
                }
                else{
                    if(data.length==0){
                        urlData._id=1
                    }
                    else{
                        max_id=data[0]._id
                        for(let row of data){
                            if(max_id<row._id){
                                max_id=row._id
                            }
                            urlData._id=max_id+1
                        }
                    }
                    urlData.info=Date()
                    db.collection('payment').insert(urlData,(err)=>{
                        if(err){
                            reject(err)
                        }
                        else{
                            db.collection('addlocation').update({'_id':parseInt(urlData.locationid)},{$set:{'status':1}},(err)=>{
                                if(err){
                                    reject(err)
                                }
                                else{
                                    resolve(true)
                                }
                            })
                        }
                    })
                }
            })
        })
    }
}

module.exports=new userModel()