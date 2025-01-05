document.addEventListener("DOMContentLoaded", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];

        chrome.scripting.executeScript(
            {
                target: { tabId: activeTab.id },
                files: ["content.js"],
            },
            () => {
                chrome.tabs.sendMessage(
                    activeTab.id,
                    { action: "calculateSum" },
                    (response) => {
                        const resultDiv = document.getElementById("result");

                        if (response && response.totalSum !== undefined) {
                            const {
                                totalSum,
                                marksForNextGrade,
                                marksFor4GPA,
                                nextGrade,
                            } = response;

                            const roundedTotalSum = totalSum.toFixed(2);
                            const roundedMarksForNextGrade =
                                marksForNextGrade.toFixed(2);
                            const roundedMarksFor4GPA = marksFor4GPA.toFixed(2);

                            resultDiv.innerHTML = `
                                <div class="result-container">
                                    <h3>Total Weightage: ${roundedTotalSum}</h3>
                                    <p class="next-grade">
                                        Weightage Required for ${nextGrade} : ${
                                marksForNextGrade > 0
                                    ? roundedMarksForNextGrade
                                    : "Already at the highest grade"
                            }
                                    </p>
                                    <p class="four-gpa">
                                        Weightage Required for 4 GPA : ${
                                            marksFor4GPA > 0
                                                ? roundedMarksFor4GPA
                                                : "Already at 4 GPA"
                                        }
                                    </p>
                                </div>
                            `;
                        } else {
                            console.error(
                                "Failed to fetch response:",
                                response
                            );
                            resultDiv.textContent =
                                "Failed to fetch data. Please try again.";
                        }
                    }
                );
            }
        );
    });
});
