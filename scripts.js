function wait(ms = 0) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function destroyPopup(popup) {
    popup.classList.remove('open'); 
    // wait for 1 second to let animation to do its work 
    await wait(1000);
    // remove it from the dom
    popup.remove();
    // remove it from javascript memory
    popup = null;
}

function ask(options) {
    // option object will have an attribute with the question and the option for the cancel button
    return new Promise(async function(resolve) {
        // first we need too create a popup with all the fields in it
        const popup = document.createElement('form');
        popup.classList.add('popup');
        popup.insertAdjacentHTML('afterbegin', 
            `
                <fieldset>
                    <label>${options.title}</label>
                    <input type="text" name="input">
                    <button type="submit">Submit</button>
                </fieldset>
            `
        );

        // check if they want a cancel button 
        if (options.cancel) {
            const skipButton = document.createElement('button');
            skipButton.type = 'button' // so it doesn't submit 
            skipButton.textContent = "Cancel"
            popup.firstElementChild.appendChild(skipButton);
            // TODO: listen for a click on that cancel button
            skipButton.addEventListener('click', () => {
                resolve(null);
                destroyPopup(popup);
            }, { once: true });
        }
        popup.addEventListener('submit', (e) => {
            e.preventDefault();
            // popup.input.value;
            resolve(e.target.input.value)
            destroyPopup(popup);
            },
            { once: true }
        );

        // listen for the submit event on the inputs

        // when someone does submit i , resolve the edat that was in the input box

        // insert that poput in the DOM
        document.body.appendChild(popup);
        await wait(50);
        popup.classList.add("open");
    });
}

async function askQuestion(e) {
    const button = e.currentTarget;
    const cancel = 'cancel' in button.dataset;
    const answer = await ask({ 
        title: button.dataset.question,
        cancel,
    });
    console.log(answer);
}

const button = document.querySelectorAll('[data-question]');
button.forEach(button => button.addEventListener('click', askQuestion));



const questions = [
    { title: "What is your name?"},
    { title: "What is your age?", cancel: true },
    { title: "What is your dog's name?"},
];

async function asyncMap(array, callback) {
    const results = [];
    for (const item of array) {
        results.push(await callback(item));
    }
    return results;
}

async function go() {
    const answers = await asyncMap(questions, ask)
    console.log(answers);
}

go();