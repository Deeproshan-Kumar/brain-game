document.addEventListener("DOMContentLoaded", () => {
  let cards = document.querySelectorAll(".card"),
    showCardsBtn = document.querySelector("#show-cards"),
    playBtn = document.querySelector("#play-btn"),
    shuffleCardsBtn = document.querySelector("#shuffle-cards"),
    restartBtn = document.querySelector("#restart"),
    understood = document.querySelector("#understood"),
    images = [
      "image-1.png",
      "image-2.png",
      "image-3.png",
      "image-4.png",
      "image-5.png",
      "image-6.png",
      "image-7.png",
      "image-8.png",
    ],
    imagePairs = [...images, ...images],
    attemptsCount = 0;

  const maxAttempts = 3;

  // Swap Images
  const shuffleImages = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      //  const temp = array[i];
      // array[i] = array[j];
      // array[j] = temp;
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  // Swap Cards
  const shuffleCards = () => {
    shuffleImages(imagePairs);
    generateCardImages();
  };

  // Show Cards
  const showCards = () => {
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add("show");
      }, index * 100);
      showCardsBtn.disabled = true;
      setTimeout(() => {
        playBtn.disabled = false;
        shuffleCardsBtn.disabled = false;
        restartBtn.disabled = false;
      }, 1600);
    });
  };

  // Hide Cards
  const hideCards = () => {
    cards.forEach((card) => {
      card.classList.remove("show");
    });
    playBtn.disabled = true;
    showCardsBtn.disabled = false;
    shuffleCardsBtn.disabled = true;
    restartBtn.disabled = false;
    initializeGame();
  };

  // Generate Images
  const generateCardImages = () => {
    cards.forEach((card, index) => {
      card.querySelector(
        ".image"
      ).innerHTML = `<img src="images/${imagePairs[index]}" />`;
    });
  };

  // Calling Generate Images Fn
  generateCardImages();

  const revealAllCards = () => {
    cards.forEach((card) => {
      card.classList.add("show");
    });
  };

  //   Creating toaster to display messages
  const toaster = (message, varient, timeout = 3000) => {
    const toaster = document.createElement("div");
    toaster.classList.add("toaster");
    toaster.setAttribute("data-varient", varient);
    toaster.textContent = message;
    document.querySelector("#toast").append(toaster);
    setTimeout(() => {
      toaster.remove();
    }, timeout);
  };

  const checkYourMemory = (card) => {
    const cardToFind = document.querySelector(".card-to-find .image img");
    const selectedCard = card.querySelector(".image img");
    attemptsCount++;

    // Check if the selected card matches the card to find
    const isMatch = cardToFind.src === selectedCard.src;

    // Update border styles based on match result
    cardToFind.style.border = isMatch ? "2px solid green" : "2px solid red";
    selectedCard.style.border = isMatch ? "2px solid green" : "2px solid red";

    // Disable the button and reveal all cards if the guess is correct
    if (isMatch) {
      toaster("Congrats! Correct guess...", "success", 5000);
      setTimeout(() => {
        revealAllCards();
      }, 500);
    } else {
      if (showCardsBtn.disabled) {
        showCardsBtn.disabled = false;
      }
    }
    showCardsBtn.disabled = true;

    // Handle the attempts count and game over condition
    const remainingAttempts = maxAttempts - attemptsCount;
    if (attemptsCount >= maxAttempts) {
      toaster(
        `Game Over! You've reached the maximum number of attempts. Remaining attempts: ${remainingAttempts}`,
        "danger",
        5000
      );
      revealAllCards();
    } else {
      toaster(`Remaining attempts: ${remainingAttempts}`, "warning", 5000);
    }
  };

  // Generating random index to show an image to find duplicate
  const randomIdx = () => {
    return Math.floor(Math.random() * 16);
  };

  const initializeGame = () => {
    // Remove any previous event listeners
    cards.forEach((card) => {
      card.removeEventListener("click", handleCardClick);
    });

    let index = randomIdx();
    if (cards) {
      cards[index].classList.add("show");
      cards[index].classList.add("card-to-find");
      // Add event listeners for the cards after initialization
      cards.forEach((card) => {
        card.addEventListener("click", handleCardClick);
      });
    }
  };

  // Event handler for card clicks
  const handleCardClick = (event) => {
    let card = event.currentTarget;
    if (
      card.classList.contains("card-to-find") ||
      card.classList.contains("show")
    ) {
      return;
    }
    card.classList.add("show");
    checkYourMemory(card);
  };

  // Reset Game
  const restartGame = () => {
    attemptsCount = 0;
    cards.forEach((card) => {
      if (
        card.classList.contains("show") ||
        card.classList.contains("card-to-find")
      ) {
        card.classList.remove("show");
        card.classList.remove("card-to-find");
        const img = card.querySelector(".image img");
        if (img) {
          img.style.border = "2px solid transparent";
        }
      }
      card.removeEventListener("click", handleCardClick);
    });
    restartBtn.disabled = true;
    showCardsBtn.disabled = false;
    toaster("", "");
  };

  //   Game Instructions Modal
  if (localStorage.getItem("understood") !== "yes") {
    document.querySelector("#modal").style.display = "block";
    document.querySelector("#overlay").style.display = "block";
  }

  const handleGameInstructionsModal = () => {
    localStorage.setItem("understood", "yes");
    if (localStorage.getItem("understood") === "yes") {
      document.querySelector("#modal").remove();
      document.querySelector("#overlay").remove();
    }
  };

  // Show Shuffle Cards Button If Cards are Showing
  showCardsBtn.addEventListener("click", showCards);
  playBtn.addEventListener("click", hideCards);
  shuffleCardsBtn.addEventListener("click", shuffleCards);
  restartBtn.addEventListener("click", restartGame);
  understood.addEventListener("click", handleGameInstructionsModal);
});
