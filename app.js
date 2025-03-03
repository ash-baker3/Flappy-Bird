let config = {
    renderer: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 300 },
          debug: false
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };
  
  let game = new Phaser.Game(config);
  let bird;
  let hasLanded = false;
  let cursors;
  let hasBumped = false;
  
  let isGameStarted = false;
  let messageToPlayer;
  
  function preload () {
    this.load.image('background', 'assets/background.png');
    this.load.image('road', 'assets/base.png');
    this.load.image('top-column', 'assets/top-column.png');
    this.load.image('bottom-column', 'assets/bottom-column.png');
    this.load.spritesheet('bird', 'assets/bird.png', { frameWidth: 64, frameHeight: 96 });
  }
  
  function create () {
    const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
    const roads = this.physics.add.staticGroup();
    const topColumns = this.physics.add.staticGroup({
      key: 'top-column',
      repeat: 1,
      setXY: {x: 200, y: 0, stepX: 300}
    })

  
    const bottomColumns = this.physics.add.staticGroup({
      key: 'bottom-column',
      repeat: 1,
      setXY: { x: 350, y: 400, stepX: 300 },
    });


    const road = roads.create(400, 568, 'road').setScale(2.5, 1.2).refreshBody();
  
  
    bird = this.physics.add.sprite(0, 50, 'bird').setScale(2);
    bird.setBounce(0.2);
    bird.setCollideWorldBounds(true);
   
    this.physics.add.overlap(bird, road, () => hasLanded = true, null, this);
    this.physics.add.collider(bird, road);
  
    this.physics.add.overlap(bird, topColumns, ()=>hasBumped=true,null, this);
    this.physics.add.overlap(bird, bottomColumns, ()=>hasBumped=true,null, this);
    this.physics.add.collider(bird, topColumns);
    this.physics.add.collider(bird, bottomColumns);
    
    cursors = this.input.keyboard.createCursorKeys();
    messageToPlayer = this.add.text(window.innerWidth / 2, window.innerHeight / 2, 'Instructions: Press space bar to start', { 
        fontFamily: '"Comic Sans MS", Times, serif', 
        fontSize: "20px", 
        color: "black", 
        backgroundColor: "white",
        align: 'center'
    }).setOrigin(0.5, 0.5); 
  
    Phaser.Display.Align.In.BottomCenter(messageToPlayer, background, 0, 50);
    messageToPlayer.y += 20; 
  }
  
  function update () {
    if(cursors.space.isDown && !isGameStarted) {
      isGameStarted = true;
      messageToPlayer.text = 'Instructions: Press the keyboard up button to stay upright \n And don\'t hit the columns or ground';
    }
  
    if(!isGameStarted) {
      bird.setVelocityY(-160);
    }
  
    if(cursors.up.isDown && !hasLanded && !hasBumped) {
      bird.setVelocityY(-160);
    }
  

    if(isGameStarted && (!hasLanded || !hasBumped)) {
      bird.body.velocity.x = 50;
    } else {
      bird.body.velocity.x = 0;
    }
  
    if(hasLanded || hasBumped) {
      messageToPlayer.text = 'Oh no! You crashed!'
    }
  
    if(bird.x > 750) {
      bird.setVelocityY(40);
      messageToPlayer.text = 'Congrats! You won!'
    }
  }