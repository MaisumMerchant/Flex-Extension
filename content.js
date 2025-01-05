chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "calculateSum") {
        const grades = [
            { grade: "F", minMarks: 0, gpa: 0 },
            { grade: "D", minMarks: 50, gpa: 1 },
            { grade: "D+", minMarks: 54, gpa: 1.33 },
            { grade: "C-", minMarks: 58, gpa: 1.67 },
            { grade: "C", minMarks: 62, gpa: 2 },
            { grade: "C+", minMarks: 66, gpa: 2.33 },
            { grade: "B-", minMarks: 70, gpa: 2.67 },
            { grade: "B", minMarks: 74, gpa: 3 },
            { grade: "B+", minMarks: 78, gpa: 3.33 },
            { grade: "A-", minMarks: 82, gpa: 3.67 },
            { grade: "A", minMarks: 86, gpa: 4 },
            { grade: "A+", minMarks: 90, gpa: 4 },
        ];

        const elements = document.querySelectorAll(".totalColObtMarks");

        function isGrandparentVisible(element) {
            const grandparent =
                element.parentElement?.parentElement?.parentElement
                    ?.parentElement?.parentElement?.parentElement;
            return grandparent && grandparent.offsetParent !== null;
        }

        const visibleElements = Array.from(elements).filter((el) =>
            isGrandparentVisible(el)
        );

        const totalSum = visibleElements
            .map((el) => parseFloat(el.textContent) || 0) // Convert text to numbers
            .reduce((acc, value) => acc + value, 0); // Sum up the values

        function calculateRequiredMarks(total) {
            let marksForNextGrade = null;
            let nextGrade = null;

            for (const grade of grades) {
                if (total < grade.minMarks) {
                    marksForNextGrade = grade.minMarks - total;
                    nextGrade = grade.grade;
                    break;
                }
            }

            const gpa4Grade = grades.find((grade) => grade.gpa === 4);
            const marksFor4GPA = gpa4Grade
                ? Math.max(gpa4Grade.minMarks - total, 0)
                : null;

            return { marksForNextGrade, marksFor4GPA, nextGrade };
        }

        const { marksForNextGrade, marksFor4GPA, nextGrade } =
            calculateRequiredMarks(totalSum);

        sendResponse({ totalSum, marksForNextGrade, marksFor4GPA, nextGrade });
    }

    return true;
});
