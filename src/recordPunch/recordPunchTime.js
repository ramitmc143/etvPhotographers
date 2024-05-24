const recordPunch = async () => {
    try {
        const now = new Date();
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        const punchTime = now.toLocaleString('en-US', options);
        console.log(`Punched at: ${punchTime}`);
        return punchTime;
    } catch (error) {
        console.log("Error in recordPunch function:", error);
        // You can handle the error here, such as logging it or displaying a user-friendly message
        // throw error; // Rethrow the error to ensure it's caught by the caller
    }
};

export default recordPunch;
