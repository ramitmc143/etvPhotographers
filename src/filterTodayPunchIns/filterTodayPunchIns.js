const filterTodayPunchIns = (employeeData) => {
    try {
        if (!Array.isArray(employeeData)) {
           console.log("Invalid input in filterTodayPunchIns : employeeData should be an array");
        }

        const today = new Date();
        const todayPunchIns = employeeData.filter(item => {
            if (!item || !item.punch_in) {
                console.log("Missing or invalid item in employeeData infilterTodayPunchIns:", item);
                return false;
            }

            const punchInDate = new Date(item.punch_in);
            if (isNaN(punchInDate)) {
                console.log("Invalid date format for punch_in in filterTodayPunchIns:", item.punch_in);
                return false;
            }

            return (
                punchInDate.getFullYear() === today.getFullYear() &&
                punchInDate.getMonth() === today.getMonth() &&
                punchInDate.getDate() === today.getDate()
            );
        });

        return todayPunchIns;
    } catch (error) {
        console.log("Error in filterTodayPunchIns:", error.message);
        return [];
    }
};

export default filterTodayPunchIns;
