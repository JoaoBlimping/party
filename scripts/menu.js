const CREDIT_MESSAGE = "Hello and welcome to my new game, I hope you have fun.\n"+
                      "Feel free to send me email about aspects of this game or my\n"+
                      "personality that you hate. marineorganism@gmail.com"


function *load()
{
  ctx.state.buildSlot();
  var slot = yield;

  if (slot >= 1 && slot <= 3)
  {
    ctx.loadGame(slot);
    if (ctx.getCharacters().length == 0)
    {
      ctx.setSlot(slot);
      ctx.addCharacter("stasbangoraKebabom");
      ctx.transport("next","start");
    }
    ctx.toOverworld();
  }
}


function *credits()
{
  ctx.state.buildTextbox("Dany Burton",CREDIT_MESSAGE,"dany_n");
  yield;
}


function *deleting()
{
  ctx.state.buildSlot(true);
  var slot = yield;

  if (slot >= 2 && slot <= 4)
  {
    ctx.setSlot(slot - 1);
    ctx.saveGame();
    ctx.state.buildTextbox("Deleted","Slot "+ctx.getSlot()+" deleted!",null);
    yield;
  }
}


while (true)
{
  ctx.state.buildQA("Vobangora Gorad Dortsars",null,"Play",
                                              "A game by Dany Burton",
                                              "Delete Saves");
  var value = yield;

  //start new game
  if (value == 1)
  {
    yield* load();
  }
  //show a pic of me!
  else if (value == 2)
  {
    yield* credits();
  }
  //delete some saves
  else if (value == 3)
  {
    yield* deleting();
  }
}
