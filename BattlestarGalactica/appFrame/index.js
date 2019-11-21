const authMW = require("../middlewares/auth/authMW");
const adminRoleCheckMW = require("../middlewares/auth/adminRoleCheckMW");
const logInUserMW = require("../middlewares/auth/logInUserMW");
const logoutMW = require("../middlewares/auth/logOutMW");
const forceLogInMW = require("../middlewares/auth/forceLogInMW");
const userListMW = require("../middlewares/auth/userListMW");

const startGameMW = require("../middlewares/admin/startGameMW");
const finishGameMW = require("../middlewares/admin/finishGameMW");
const dealCardsMW = require("../middlewares/admin/dealCardsMW");
const createPlayerMW = require("../middlewares/admin/createPlayerMW");
const updatePlayerMW = require("../middlewares/admin/updatePlayerMW");
const deletePlayerMW = require("../middlewares/admin/deletePlayerMW");
const listAllPlayersMW = require("../middlewares/admin/listAllPlayersMW");
const listAllCardPacksMW = require("../middlewares/admin/listAllCardPacksMW");
const editPlayerMW = require("../middlewares/admin/editPlayerMW");
const getEditedUserMW = require("../middlewares/admin/getEditedUserMW");

const revealMW = require("../middlewares/play/revealMW");
const requestRevealMW = require("../middlewares/play/requestRevealMW");
const executeMW = require("../middlewares/play/executeMW");
const listParticipatingPlayersMW = require("../middlewares/play/listParticipatingPlayersMW");

const listCardsMW = require("../middlewares/cards/listCardsMW");

const navBarMW = require("../middlewares/navBarMW");
const renderMW = require("../middlewares/renderMW");

const initDB = require("../config/initDB");

const IdentityDeck = require("../models/IdentityDeck");
const Card = require("../models/Card");
const Player = require("../models/Player");
const Game = require("../models/Game");
const CardPack = require("../models/CardPack");
const PlayerWithCards = require("../models/PlayerWithCards");
const IdentityCard = require("../models/IdentityCard");

module.exports = function(app) {
  const objRepo = {
    adminLoggedInState: false,
    gameStarted: false,
    loggedInUsers: [],
    editedUser: undefined,

    IdentityDeck: IdentityDeck,
    Card: Card,
    Player: Player,
    Game: Game,
    CardPack: CardPack,
    PlayerWithCards: PlayerWithCards,
    IdentityCard: IdentityCard
  };

  IdentityDeck.find()
    .populate("cards")
    .exec((err, decks) => {
      if (decks.length === 0) {
        initDB(objRepo);
      }
    });

  function editUser(user) {
    objRepo.editedUser = user;
  }

  function endGame() {
    objRepo.adminLoggedInState = false;
    objRepo.gameStarted = false;
    objRepo.loggedInUsers = [];

    Game.remove({}).exec();
  }

  function setAdminLoggedInState(state) {
    objRepo.adminLoggedInState = state;
  }

  function setGameStarted(state) {
    objRepo.gameStarted = state;
  }

  function addLoggedInUsers(user) {
    objRepo.loggedInUsers.push(user);
  }

  function reremoveLoggedInUsers(user) {
    objRepo.loggedInUsers.splice(objRepo.loggedInUsers.indexOf(user), 1);
  }

  // the root of the web aplication navigates to
  // admin or player login depanding on the applications state
  app.get("/", function(req, res, next) {
    if (objRepo.adminLoggedInState && objRepo.gameStarted) {
      res.redirect("/players");
    } else {
      res.redirect("/admin");
    }
  });

  // admin login
  app.use(
    "/admin",
    function(req, res, next) {
      if (objRepo.adminLoggedInState && objRepo.gameStarted) {
        res.redirect("/players");
      } else {
        next();
      }
    },
    logInUserMW(objRepo, setAdminLoggedInState, addLoggedInUsers),
    forceLogInMW(objRepo),
    navBarMW(1),
    userListMW(objRepo),
    renderMW(objRepo, "login")
  );

  // player login
  app.use(
    "/players",
    function(req, res, next) {
      if (req.session.loggedIn) {
        res.redirect("/play-game");
      } else {
        if (objRepo.adminLoggedInState && objRepo.gameStarted) {
          next();
        } else {
          res.redirect("/admin");
        }
      }
    },
    logInUserMW(objRepo, setAdminLoggedInState, addLoggedInUsers),
    forceLogInMW(objRepo),
    navBarMW(1),
    userListMW(objRepo),
    renderMW(objRepo, "login")
  );

  // lists cards
  app.get(
    "/cards",
    listCardsMW(objRepo),
    navBarMW(0),
    renderMW(objRepo, "cards")
  );

  // shows the main game screen
  app.get(
    "/play-game",
    authMW(objRepo),
    navBarMW(1),
    listParticipatingPlayersMW(objRepo),
    renderMW(objRepo, "play-game")
  );

  // executes the player this means he/she needs a new dealing
  app.post(
    "/execute",
    authMW(objRepo),
    executeMW(objRepo),
    renderMW(objRepo, "play-game")
  );

  // reveals the card or cards of the player
  app.post(
    "/reveal",
    authMW(objRepo),
    revealMW(objRepo),
    renderMW(objRepo, "play-game")
  );

  // requests a reveal from another player
  app.post(
    "/request-reveal",
    authMW(objRepo),
    requestRevealMW(objRepo),
    renderMW(objRepo, "play-game")
  );

  /////////////////////////////////// Admin only ////////////////////////////////////////////

  // this is the main game management screen
  app.get(
    "/manage-game",
    authMW(objRepo),
    adminRoleCheckMW(objRepo),
    navBarMW(2),
    function(req, res, next) {
      res.locals.gameStarted = objRepo.gameStarted;
      next();
    },
    listAllPlayersMW(objRepo),
    listAllCardPacksMW(objRepo),
    renderMW(objRepo, "manage-game")
  );

  // starts tha game with the settings from the manage-game form
  app.post(
    "/start-game",
    authMW(objRepo),
    adminRoleCheckMW(objRepo),
    startGameMW(objRepo, setGameStarted, addLoggedInUsers)
  );

  // deals cards for the players
  app.post(
    "/deal-cards",
    authMW(objRepo),
    adminRoleCheckMW(objRepo),
    dealCardsMW(objRepo)
  );

  // closes the game
  app.post(
    "/finish-game",
    authMW(objRepo),
    adminRoleCheckMW(objRepo),
    finishGameMW(objRepo, endGame)
  );

  // this is the main player management screen
  app.get(
    "/manage-players",
    authMW(objRepo),
    adminRoleCheckMW(objRepo),
    listAllPlayersMW(objRepo),
    navBarMW(3),
    getEditedUserMW(objRepo),
    renderMW(objRepo, "manage-players")
  );

  // this adds new players
  app.post(
    "/manage-players",
    authMW(objRepo),
    adminRoleCheckMW(objRepo),
    createPlayerMW(objRepo)
  );

  // edit player specified in params
  app.put(
    "/edit-player/:player",
    authMW(objRepo),
    adminRoleCheckMW(objRepo),
    editPlayerMW(objRepo, editUser)
  );

  // update player specified in params
  app.put(
    "/update-player/:player",
    authMW(objRepo),
    adminRoleCheckMW(objRepo),
    updatePlayerMW(objRepo, editUser)
  );

  // delete player specified in params
  app.delete(
    "/delete-player/:player",
    authMW(objRepo),
    adminRoleCheckMW(objRepo),
    deletePlayerMW(objRepo, editUser)
  );

  // logout
  app.use("/logout", logoutMW(objRepo, endGame, reremoveLoggedInUsers));
};
