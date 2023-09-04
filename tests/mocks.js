// Mock database
const database = {
    users: [

        {
            id: 1,
            email: "A@A.fi",
            admin: true,
            password: "$2a$10$IML8QCf6xA.alRbW.CG5PuvYc3Qs94vJvoTwbsSehs8s515cUMuZa",
        }

    ],

    topics: [

        {
            id: 1,
            user_id: 1,
            name: "Test_topic"
        }

    ],

    questions: [

        {
            id: 1,
            user_id: 1,
            topic_id: 1,
            question_text: "Test_question",
        }

    ],

    question_answer_options: [

        {
            id: 1,
            question_id: 1,
            option_text: "True",
            is_correct: true,
        },
        {
            id: 2,
            question_id: 1,
            option_text: "False",
            is_correct: false,
        }


    ],

    question_answers: [],

}


// Database getter mock functions
const getUser = (id) => {

    let res = {};

    for (let i = 0; i < database.users.length; i++) {
        if (database.users[i].id === id) res = database.users[i];
    }

    return res;
}

const getStatistics = () => {
    return {
        question_count: database.questions.length,
        answer_count: database.question_answers.length,
        topic_count: database.topics.length,
    };
}


// Mock context object
const context = {

    response: {
        body: {},
        redirect: (string) => {redirectPath.path = string;},
    },

    request: {
        body: {
            value: {},
        },
    },

    render: (string, data) => {renderFile.filename = string; renderFile.data = data;},

    state: {
        session: {
            set: (key, value) => {session[key] = value;},
        }
    },

    params: {

    }
}

// Mock session
const session = {};

// Mock session getter function
const getSession = () => {
    return session;
}

// Mock rendered file:
const renderFile = {
    filename: "",
    data: {},
}

// Mock redirect path
const redirectPath = {
    path: "",
}

// Mock redirect path getter function
const getRedirPath = () => {
    return redirectPath.path;
}

// Service mocks:
const allQuestions = async () => {
    return await database.questions;
}


const allQuestionAnsOptions = async (question_id) => {
    
    const res = [];

    for (let i = 0; i < database.question_answer_options.length; i++) {
        const option = database.question_answer_options[i];
        if (option.question_id === question_id) {
            res.push(option);
        }
    }

    return res;
}


const optionWithId = async (option_id) => {

    const res = [];

    for (let i = 0; i < database.question_answer_options.length; i++) {
        const option = database.question_answer_options[i];
        if (option.id === option_id) {
            res.push(option);
        }
    }

    return res;
}


const userExists = (email) => {

    let res = false;

    for (let i = 0; i < database.users.length; i++) {
        const user = database.users[i];
        if (user.email === email) res = true;
    }

    return res;

}


const addUser = (email, password) => {

    database.users.push({
                            id: 2,
                            email: email,
                            admin: false,
                            password: password,
                        });

}


const getUserWithEmail = (email) => {
    const res = [];

    for (let i = 0; i < database.users.length; i++) {
        const user = database.users[i];
        if (user.email === email) res.push(user);
    }

    return res;
}

const allAnswers = async () => {
    return database.question_answers.length;
}


const allTopics = async () => {
    return database.topics.length;
}


const allTopicQuestions = async (topic_id) => {
    const res = [];

    for (let i = 0; i < database.topics.length; i++) {
        const topic = database.topics[i];
        if (topic.id === topic_id) {
            res.push(topic);
        }
    }

    return res;
}

export  { 
    context, 
    allQuestions, 
    allQuestionAnsOptions,
    optionWithId,
    getUser,
    userExists,
    addUser,
    getSession,
    getUserWithEmail,
    getStatistics,
    allAnswers,
    allTopics,
    getRedirPath,
    allTopicQuestions,
}