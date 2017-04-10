

$("#testButton").click(updateUserData);

function writeUserData(userId, name, email, imageUrl) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture : imageUrl
  });
}

var dbRef = firebase.database().ref('users/' + uid).child("KillAmount");
dbRef.set(Math.round(killAmount * 10));
dbRef.on('value', function(datashot){
    //console.log(datashot.val());
$("#killCounter").text(datashot.val());
});

function updateUserData() {
  console.log(uid);
  console.log(displayName);
  console.log(email);
  console.log(photoURL);
  writeUserData(uid, displayName, email, photoURL);
}
