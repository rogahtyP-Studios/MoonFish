function startGame() {
    Area.start();

    a = new ShipCore(480, 270);

    for (var i = 0; i < 10; i++) {
        spawners[i] = new Spawner(Math.floor((Math.random() * 100)), Math.floor((Math.random() * 100)));
    }

    //Shop section
    buttons[0] = new button(10, 10, "Upgrade Ship",0);
    buttons[1] = new button(10, 110, "Upgrade health", 5);
    buttons[2] = new button(10, 210, "Buy Cannon", 10);
    buttons[3] = new button(10, 260, "Buy Armor", 5);

    chats = new Chat("Queen Davida: <To be added>", 5);
    Shot = new sound("assets/shot.mp3");
    Theme = new sound("assets/to_space.mp3");
}
