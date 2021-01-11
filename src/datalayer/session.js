function Session(db, username, password){
  console.log("Creating new session");
  this.db = db;
  if(username) {
    db.getUsers({username: username}).then(user =>{
      if(user.authenticate(password)){
        this.user = user;
      } else {
        Promise.reject("Incorrect Password");
        return {invalid: true};
      }
    });
  } else {
    this.user = db.getGuest();
    this.ownerID = this.user.id;
    
    this.lastModified = Date.now();
    this.createdBy = this.modifiedBy = this.user.username + ":" + this.ownerID + ":" + this.lastModified.toString();
  }
};

Session.prototype.getProject = async function(){
  return await this.project || (this.project = this.db.addProject(), this.project);
}

export default Session;