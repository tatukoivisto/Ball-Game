$(document).ready(function () {



  var levelSpeed = 250;
	var killAmount = 0;
  var lifeAmount = 3;
  var enemySpeed = 100;


/*
  function checkUserStatus() {
    var userIn = firebase.auth().currentUser;
    console.log("userStatus: " + userIn);
    if(userIn){
      handleSignedInUser(userIn);
    }else{
      handleSignedOutUser();
    }
  }
*/

function playAgain(){
  var answer = confirm("Your score was " + Math.round(killAmount*10) + ". Play again?");
  if(answer === true) {
    startGame();
  }else {
    console.log("handleSignedInUser 2");
    handleSignedOutUser();
  }
}


  $("#pause").click(pauseEvent);
  $("#pause").hover(
    function(){

    TweenLite.to($("#pause"), 0.1, {scale:1.2, ease: Back.easeInOut});
  },function(){

    TweenLite.to($("#pause"), 0.1, {scale:1, ease: Back.easeInOut});
  }
);

  function pauseEvent(){
    if(game){
      if(game.paused) {
        //MENU IN
        game.paused = false;
        $("#pause").attr("src","images/pause.svg");
        TweenLite.to($("#photo-container"), 0.2, {height:"15.5vh", ease: Back.easeInOut});
        TweenLite.to($(".pause-item"), 0.2, {display:"none", ease: Back.easeInOut});
        TweenLite.to($(".pause-inline"), 0.2, {display:"none", ease: Back.easeInOut});
        TweenLite.to($("#photo"), 0.2, {left:"50%", marginLeft:"0px", ease: Back.easeInOut, delay: "0.2"});
        TweenLite.to($("#photo-container"), 0.2, {width:"15.5vh", height:"15.5vh", ease: Back.easeInOut, delay: "0.2"});
        TweenLite.to($("#photo-container"), 0.2, {top:"5px", ease: Back.easeInOut, delay: "0.4"});
        TweenLite.to($("#photo"), 0.2, {width:"8vh", height:"8vh", marginTop: "9px", ease: Back.easeInOut, delay: "0.4"});
        TweenLite.to($("#photo-container"), 0.2, {width:"10.5vh", height:"10.5vh", ease: Back.easeInOut, delay: "0.4"});


      }else {
        //MENU OUT
      console.log("menu out");
      game.paused = true;
      $("#pause").attr("src","images/play.svg");
      TweenLite.to($("#photo-container"), 0.2, {width:"15.5vh", height:"15.5vh", ease: Back.easeInOut});
      TweenLite.to($("#photo"), 0.2, {width:"12vh", height:"12vh", marginTop: "12px", ease: Back.easeInOut});
      TweenLite.to($("#photo-container"), 0.2, {top:"+35px", ease: Back.easeInOut });
      TweenLite.to($("#photo-container"), 0.2, {width:"400px", ease: Back.easeInOut, delay: "0.2"});
      TweenLite.to($("#photo"), 0.2, {left:"0%", marginLeft:"60px", ease: Back.easeInOut, delay: "0.2"});
      TweenLite.to($(".pause-item"), 0.2, {display:"block", ease: Back.easeInOut, delay: "0.2"});
      TweenLite.to($(".pause-inline"), 0.2, {display:"inline-block", ease: Back.easeInOut, delay: "0.2"});
      TweenLite.to($("#photo-container"), 0.2, {height:"auto", ease: Back.easeInOut, delay: "0.2"});
      }
   }else {
     console.log("no game to pause");
   }
  }




  $("#startButton").click(function(){
        console.log("startGame");
        TweenLite.to($("#photo-container"), 0.5, {scale:0.6, ease: Back.easeInOut});
        TweenLite.to($("#photo-container"), 0.5, {y:"-35", ease: Back.easeInOut, delay: "0.5"});
        startGame();
  });
 var game;
 console.log("test");

 var startGame = function() {

   levelSpeed = 200;
   killAmount = 0;
   lifeAmount = 3;
   enemySpeed = 150;


     var lifeElement = '<li class="life-list-item"><img id="life" src="/images/life.svg" alt="kuvaa ei löytynyt"></img></li>';
     for(i = 0; i < lifeAmount; i++){
       $(".life-list").append(lifeElement);
       console.log("life generated");
     }


     var dbRefHighScore = firebase.database().ref('users/' + uid).child("highScore");
     dbRefHighScore.on('value', function(datashot){
       if(datashot.val === undefined){
        console.log("highScore undefined");
         $("#high-score").text(0);
       }else {
         console.log("highScore defined");
         $("#high-score").text(datashot.val());
       }
     });




   $(".buttonHolder").hide();

   game = new Phaser.Game('100%', '96vh', Phaser.AUTO, '', { preload: preload, create: create, update: update });


        function preload () {
        	game.load.spritesheet('ball', 'images/ball.png', 50, 50);
        	game.load.image('particle', 'images/particle.png');
          game.load.image('enemy', 'images/enemy.png');
        //  game.load.text('levels', 'data/levels.json');
        }

        var mainBall;
        var mainBallSize = 0.3;
        var emitter;
        var particle;
        var enemy;


      function emitterCreate () {
        emitter = game.add.emitter(game.world.randomX, game.world.randomY);
        emitter.makeParticles('particle',1, 10, true, true);
        emitter.setXSpeed(-200, 200);
        emitter.setYSpeed(-200, 200);
        emitter.minParticleScale = 0.12;
        emitter.maxParticleScale = 0.12;
        emitter.gravity = 0;
        emitter.bounce.setTo(1, 1);
        emitter.start(false, -1, 150);
      }

    function enemyCreate(speed, amount, scale) {
          /* ADDING THE ENEMY */
        console.log(enemy);
        enemy.makeParticles('enemy', 1, amount, true, true);
        enemy.setXSpeed(-1 * speed, speed);
        enemy.setYSpeed(-1 * speed, speed);
        enemy.minParticleScale = scale;
        enemy.maxParticleScale = scale;
        enemy.gravity = 0;
        enemy.bounce.setTo(1, 1);
        enemy.start(false, -1, 150);
    }




      function create () {

      game.stage.backgroundColor = '#B6E4CC';
			this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

			/* ADDING THE MAINBALL SPRITE */
      mainBall = game.add.sprite(0, 0, 'ball');
      mainBall.frame = 0;
      game.physics.arcade.enable([mainBall]);


      // var levelData = JSON.parse(this.game.cache.getText('levels'));

      //  console.log(levelData);
      //  console.log(levelData.levelSpeed.s + " = speed");

        	/* ANIMATING THE MAINBALL */

        mainBall.animations.add('left-right', [1, 2, 3], 200, true);
		    mainBall.animations.add('up-down', [4, 5, 6], 200, true);
			  mainBall.animations.add('kaakko', [7, 8, 9], 200, true);
		    mainBall.animations.add('koillinen', [10, 11, 12], 200, true);


        	/* MAIN BALL SETTINGS */

        mainBall.body.collideWorldBounds = true;
        mainBall.anchor.set(0.5);
        mainBall.scale.setTo(mainBallSize);

        	/* ADDING THE PARTICLES */

		    emitter = game.add.emitter(game.world.centerX, game.world.centerY);
		    emitter.makeParticles('particle',1, 10, true, true);
		    emitter.setXSpeed(-200, 200);
        emitter.setYSpeed(-200, 200);
        emitter.minParticleScale = 0.12;
        emitter.maxParticleScale = 0.12;
	      emitter.gravity = 0;
		    emitter.bounce.setTo(1, 1);
		    emitter.start(false, -1, 150);

          /* ADDING THE ENEMY */
        enemy = game.add.emitter(game.world.width, game.world.height);
        enemy.makeParticles('enemy', 1, 3, true, true);
        enemy.setXSpeed(-100, 100);
        enemy.setYSpeed(-100, 100);
        enemy.minParticleScale = 0.5;
        enemy.maxParticleScale = 0.5;
        enemy.gravity = 0;
        enemy.bounce.setTo(1, 1);
        enemy.start(false, -1, 150);

          /* CONTROLS */
        cursors = game.input.keyboard.createCursorKeys();
        spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(pauseEvent, this);
        }

/* GAME FUNCTIONS */

	function speed() {
    if(Math.round(killAmount*10) < 10){
      return levelSpeed;
    }else if(Math.round(killAmount*10) < 30){
      return levelSpeed + (levelSpeed/5) * killAmount;
    }else {
      return 280;
    }

	}

	function diagonalSpeed(){
		return (Math.sqrt((Math.pow(speed(),2)/2))/speed() * speed());
	}

 // PARTICLE PLAYER COLLISION
	function onCollision(emitter, mainBall) {
		mainBall.destroy();
		killAmount += 0.1;

    var dbRef = firebase.database().ref('users/' + uid).child("KillAmount");
    dbRef.set(Math.round(killAmount * 10));
    dbRef.on('value', function(datashot){
        //console.log(datashot.val());
    $("#killCounter").text(datashot.val());
    });

    if(Math.round(killAmount*10) == 10){
      console.log("emitterCreate");
      enemyCreate(300, 1, 0.5);
      emitterCreate();
    }else if(Math.round(killAmount*10) == 20){
      enemyCreate(300, 3, 0.3);
      emitterCreate();
    }else if(Math.round(killAmount*10) == 30){
      enemyCreate(400, 1, 0.2);
      emitterCreate();
    }else if(Math.round(killAmount*10) == 40){
      enemyCreate(400, 3, 0.3);
      emitterCreate();
    }else if(Math.round(killAmount*10) == 50){
      enemyCreate(500 , 1, 0.2);
      emitterCreate();
    }else if(Math.round(killAmount*10) == 60){
      enemyCreate(500 , 4, 0.2);
      emitterCreate();
    }else if(Math.round(killAmount*10) == 70){
      enemyCreate(500 , 1, 0.5);
      emitterCreate();
    }else if(Math.round(killAmount*10) == 80){
      enemyCreate(500 , 4, 0.5);
      emitterCreate();
    }else if(Math.round(killAmount*10) == 90){
      enemyCreate(600 , 10, 0.3);
      emitterCreate();
    }else if(Math.round(killAmount*10) == 100){
      enemyCreate(1000 , 15, 0.2);
      emitterCreate();
    }else if(Math.round(killAmount*10) == 110){
      enemyCreate(1500 , 20, 0.1);
      emitterCreate();
    }else if(Math.round(killAmount*10) == 120){
      enemyCreate(2000 , 20, 1);
      emitterCreate();
    }
	}

  function gameEnd(){
    console.log( "GAME END Math.round(killAmount*10): " + Math.round(killAmount*10));

    var currentHighScore;
    function getHighScore() {
       firebase.database().ref('/users/' + uid).once('value').then(function(snapshot) {
        currentHighScore = snapshot.val().highScore;
      /*  console.log("currentHighScore: " + currentHighScore);
        console.log("2currentHighScore: " + currentHighScore);
        console.log("killAmount: " + Math.round(killAmount) * 10 + " currentHighScore: " + currentHighScore); */
        if(currentHighScore === undefined){
          firebase.database().ref('users/' + uid).update({
            highScore: Math.round(killAmount * 10)
          });
          console.log("uusi ennätys undefined");
        }else if(Math.round(killAmount) * 10 > currentHighScore){

          firebase.database().ref('users/' + uid).update({
            highScore: Math.round(killAmount * 10)
          });
          console.log("uusi ennätys");
        }else{
          console.log("ei uutta ennätystä");
        }
playAgain();
      });
    }
    getHighScore();


    game.destroy();



/*
    getHighScore(function(){
      console.log("getHighScore FUNCTION RUN");
      game.destroy(function(){
        var answer = confirm("Your score was " + Math.round(killAmount*10) + ". Play again?");
        if(answer === true) {
          startGame();
        }else {
          handleSignedOutUser();
        }
      });
    });

*/
    //game.destroy();
  //  var answer = confirm("Your score was " + Math.round(killAmount*10) + ". Play again?");

/*    var dbRef = firebase.database().ref('users/' + uid).child("high_score");
    dbRef.set(Math.round(killAmount * 10));
    dbRef.on('value', function(datashot){
        //console.log(datashot.val());
    $("#killCounter").text(datashot.val());
  });*/

    /*if(killAmount > high_score){
      firebase.database().ref('users/' + userId).set({
        high_score: killAmount
      });
    }*/


  }


  // ENEMY PLAYER COLLISION
   function enemyPlayerCollision(enemy, mainBall) {
     lifeAmount -= 1;
     console.log(lifeAmount);
     $('.life-list-item').first().remove();
     if(lifeAmount === 0){
       console.log("Math.round(killAmount*10): " + Math.round(killAmount*10));
       gameEnd();
     }
     enemy.x = 0;
     enemy.y = 0;


   }


/* GAME FUNCTIONS */

  /*var dbKillAmountRef = firebase.database().ref('users/' + uid).child("KillAmount");

  dbKillAmountRef.on('value', function(datashot){
    console.log(datashot.val());
    dbKillAmount.innerText = datashot.val();
    console.log("yritys2");
  });*/



    function update () {

      game.physics.arcade.collide(emitter, mainBall, onCollision, null, this);
      if(Math.round(killAmount*10) < 20){
        mainBall.scale.setTo(mainBallSize + (killAmount/2));
      }else if (Math.round(killAmount*10) > 40) {
        mainBall.scale.setTo(mainBallSize);
      }
      else{
        mainBall.scale.setTo(mainBallSize + 1);
      }

	    mainBall.body.velocity.x = 0;
	    mainBall.body.velocity.y = 0;


    	/* ANIMATION CONTROLLERS */
    	if(cursors.up.isDown && cursors.left.isDown) {
	        mainBall.animations.play('kaakko');
	        mainBall.body.velocity.x = -1 * diagonalSpeed();
	        mainBall.body.velocity.y = -1 * diagonalSpeed();


	       //console.log("luode: " + (Math.sqrt((Math.pow(speed,2))/2))/speed * speed);
	      // console.log("luode: " + (Math.sqrt((Math.pow(speed(),2))/2))/speed() * speed());
	    }
	    else if(cursors.down.isDown && cursors.right.isDown) {
	    	mainBall.animations.play('kaakko');
	    	mainBall.body.velocity.x = 1 * diagonalSpeed();
	    	mainBall.body.velocity.y = 1 * diagonalSpeed();

	      //  console.log("kaakko");
	    }
	    else if (cursors.up.isDown && cursors.right.isDown) {
	       mainBall.animations.play('koillinen');
	       mainBall.body.velocity.x = 1 * diagonalSpeed();
	       mainBall.body.velocity.y = -1 * diagonalSpeed();

	      // console.log("koillinen");
	    }
	    else if(cursors.down.isDown && cursors.left.isDown) {
	       mainBall.animations.play('koillinen');
	       mainBall.body.velocity.x = -1 * diagonalSpeed();
	       mainBall.body.velocity.y = 1 * diagonalSpeed();

	       //console.log("lounas");
	    }
	    else if(cursors.right.isDown) {
	      mainBall.animations.play('left-right');
	      mainBall.body.velocity.x = 1 * speed();
	      //console.log("right");
	    }
	    else if(cursors.left.isDown) {
	      mainBall.animations.play('left-right');
	      mainBall.body.velocity.x = -1 * speed();
	      //console.log("left");
	    }
	    else if(cursors.down.isDown) {
	        mainBall.animations.play('up-down');
	        mainBall.body.velocity.y = 1 * speed();
	       // console.log("down");
	    }
	    else if(cursors.up.isDown) {
	        mainBall.animations.play('up-down');
	        mainBall.body.velocity.y = -1 * speed();
	       // console.log("up");
	    }
	    else {
	    	mainBall.animations.stop();
	    	mainBall.frame = 0;
	    	//console.log("stop");
	    }
      game.physics.arcade.overlap(mainBall, enemy, enemyPlayerCollision, null, this);
      // UPDATE ENDS
    }



    // STARTGAME ENDS
  };



    // Initialize Firebase
    // Initialize Firebase
    // Initialize Firebase
    // Initialize Firebase
    // Initialize Firebase
    // Initialize Firebase
    // Initialize Firebase
    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyAxcbA_3s4Rp8RZ56dM9ScSnZs5FCeZ40c",
      authDomain: "ganimation-16370.firebaseapp.com",
      databaseURL: "https://ganimation-16370.firebaseio.com",
      projectId: "ganimation-16370",
      storageBucket: "ganimation-16370.appspot.com",
      messagingSenderId: "663651479968"
    };
    firebase.initializeApp(config);



    // FirebaseUI config.
    var uiConfig = {
      'callbacks': {
      // Called when the user has been successfully signed in.
        'signInSuccess': function(user, credential, redirectUrl) {
          console.log("handleSignedInUser 3");
          handleSignedInUser(user);
          // Do not redirect.
          return false;
        }
      },
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      ],
      // Terms of service url.
      tosUrl: '<your-tos-url>'
    };
    // Initialize the FirebaseUI Widget using Firebase.
    var ui = new firebaseui.auth.AuthUI(firebase.auth());

    var currentUid = null;
    // The start method will wait until the DOM is loaded.
  //  ui.start('#firebaseui-auth-container', uiConfig);

        var displayName;
        var email;
        var emailVerified;
        var photoURL;
        var uid;
        var providerData;

         initApp = function() {
           firebase.auth().onAuthStateChanged(function(user) {
             if (user) {
               console.log(user + " User is signed in: if(user)");
               // User is signed in.
               displayName = user.displayName;
               email = user.email;
               emailVerified = user.emailVerified;
               photoURL = user.photoURL;
               uid = user.uid;
               providerData = user.providerData;
               /*user.getToken().then(function(accessToken) {
                 document.getElementById('sign-in-status').textContent = 'Signed in';
               });*/
               console.log("handleSignedInUser 1");
               handleSignedInUser(user);
             } else {
               // User is signed out.
               displayName = null;
               email = null;
               emailVerified = null;
               photoURL = null;
               uid = null;
               providerData = null;

               console.log(user + " user ei määritelty haara (else)");
               //document.getElementById('sign-in-status').textContent = 'Signed out';
               handleSignedOutUser();
               gameEnd();
             }
           }, function(error) {
             console.log(error);
           });



         };

         /*window.addEventListener('load', function() {
           initApp();
           console.log("app inited");
         });*/



    // User In
      var handleSignedInUser = function(user) {
        console.log("inhappened");
        currentUid = uid;
        /*function checkHighScore() {
          if()
          firebase.database().ref('users/' + userId).set({
           high_score: killAmount
         });
       }*/




        function writeUserData(userId, name, email, imageUrl) {
          console.log("user data sent");
          firebase.database().ref('users/' + userId).update({
            username: name,
            email: email,
            profile_picture : imageUrl
          });
        }
        writeUserData(uid, displayName, email, photoURL);
        document.getElementById('photo-container').style.display = 'block';
        $(".signed-in").css("display", "block");
        $(".pause-holder").css("display", "inline");
        console.log("photoURL: " + photoURL);
        document.getElementById('menu-name').innerText = displayName;
        if (photoURL){
          document.getElementById('photo').src = photoURL;
          document.getElementById('photo').style.display = 'block';
        } else {
          document.getElementById('photo').style.display = 'none';
        }
      };

    /* Display the UI for a signed out user. */
    var handleSignedOutUser = function() {
      console.log("outhappened");
      $(".signed-in").css("display", "none");
      $(".pause-holder").css("display", "none");

      document.getElementById('photo-container').style.display = 'none';
      ui.start('#firebaseui-auth-container', uiConfig);
      console.log(game);
      game.destroy();
    };

    $("#sign-out-text").click(signOutClicked);
    function signOutClicked() {
      firebase.auth().signOut().then(function() {
      // Sign-out successful.
      }).catch(function(error) {
      // An error happened.
      });
    }

    $("#sign-out-text").hover(
      function(){
      TweenLite.to($("#sign-out-text"), 0.1, {scale:1.2, ease: Back.easeInOut});
    },function(){

      TweenLite.to($("#sign-out-text"), 0.1, {scale:1, ease: Back.easeInOut});
    }
  );
  $("#startButton").hover(
    function(){
    TweenLite.to($("#startButton"), 0.2, {scale:1.1, ease: Back.easeInOut});
  },function(){

    TweenLite.to($("#startButton"), 0.2, {scale:1, ease: Back.easeInOut});
  }
);

//checkUserStatus();


initApp();
/*
var dbRef = firebase.database().ref('users/' + uid).child("KillAmount");
dbRef.set(Math.round(killAmount * 10));
dbRef.on('value', function(datashot){
    //console.log(datashot.val());
$("#killCounter").text(datashot.val());
});*/





});
