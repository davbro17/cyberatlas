const getGuest = function(User){
  const guest = new User({
    id: 0,
    username: "guest",
    creationDate: Date.now(),
    lastLogin: Date.now()
  })
  return function(){
    return guest;
  }
};

export default getGuest;