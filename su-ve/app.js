const getDictionary = async () => await (await fetch("dict.json")).json();
const getRandomWord = dict => {
    const dictSize = dict.length;
    if (dictSize) {
        // get random 4 words
        const nums = new Set();
        while (nums.size !== 4) {
            nums.add(Math.floor(Math.random() * dictSize));
        }

        return ({
            right: [...nums][0],
            nums: [...nums].sort(() => Math.random() - 0.5)
        });
    }
};
const getQuestion = (dict, word, quiz) => {
    const randomWord = getRandomWord(dict);
    word.innerHTML = dict[randomWord.right].fi;
    
    randomWord.nums.forEach(num => {
        const newDiv = document.createElement("div");
        const newContent = document.createTextNode(dict[num].ru);
        newDiv.appendChild(newContent);

        newDiv.addEventListener("click", () => {
            if (num === randomWord.right) {
                alert("right");
            } else {
                alert("wrong");
            }

            quiz.innerHTML = "";
            getQuestion(dict, word, quiz);
        });
        quiz.appendChild(newDiv);
    });
};

(async () => {
    const dict = await getDictionary();
    const word = document.querySelector("#word");
    const quiz = document.querySelector("#quiz");

    getQuestion(dict, word, quiz);
})();
