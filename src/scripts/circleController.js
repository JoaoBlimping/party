#include "std.js"

var angle = 0;
var bullets = state.createBulletGroup(caller,100,60,'blood1','shot');
var otherBullets = state.createBulletGroup(caller,80,70,'blood2','drip');
var player = state.player;
var xOffset = caller.body.width / 2;
caller.animations.add("red",[8,9,8,9,10,9,10,11],4,false);


function* waveBit()
{
  const N_WAVES = 10;
  var currentOnes = [];

  for (var i = 0;i < N_WAVES;i++) currentOnes.push(bullets.fire(caller.body.x + xOffset,caller.body.y,0,0,Math.PI * 2 / N_WAVES * i - Math.PI));
  yield* wait(1000);
  for (var i = 0;i < N_WAVES;i++) currentOnes[i].redirect(Math.atan2(player.y - currentOnes[i].y,player.x - currentOnes[i].x),bullets.speed);
}


function* gravityBit()
{
  var elapsed = yield(null);
  angle += elapsed / 150;
  caller.body.velocity.x = Math.sin(angle) * caller.properties.moveSpeed;
  caller.body.velocity.y = Math.cos(angle) * caller.properties.moveSpeed;
  thickCircle.update(elapsed);
  thinCircle.update(elapsed);
}





//caller.setHalo("waves",3,10);



/** a periodic thing for firing a thick circle in the bullets group */
var thickCircle = new Periodic(90,function()
{
  bullets.fire
  (
    caller.body.x + xOffset,caller.body.y,player.body.x - caller.body.x,
    player.body.y - caller.body.y,Math.random() * Math.PI * 2 - Math.PI
  );
});

/** periodic for a thin circle in otherBullets */
var thinCircle = new Periodic(70,function()
{
  otherBullets.fire(caller.body.x + xOffset,caller.body.y,0,0,angle);
});




//logic starts hereW
yield* speak("n","I am going to kill you");



/* just fires thinCircle */
caller.fighting = true;
while (caller.health > 80)
{
  var elapsed = yield(null);
  angle += elapsed / 110;
  thinCircle.update(elapsed);
}

//a little chat in between
caller.fighting = false;
music.fadeOut(1000,Channel.Music);//TODO: put this into std
yield* speak("n","Yeah ok, but check out...");
sound.play("charge");
yield* waitAnimation("red");
music.playSong("trogBattle",Channel.Music);
yield* speak("n","MELTING ATTACK!!");
state.setOverlay("fog",100,300);
caller.fighting = true;



//second loop with both at once
thinCircle.period *= 2;
while (caller.health > 40) yield* waveBit();

while (caller.health > 0) yield* gravityBit();

caller.fighting = false;
yield* speak("n","I am dead now");
state.removeOverlay();
sound.play("fiendDeath");
yield* waitAnimation("red");