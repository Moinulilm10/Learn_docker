import { useEffect, useState } from "react";
import CourseGoals from "./components/goals/CourseGoals";
import GoalInput from "./components/goals/GoalInput";
import ErrorAlert from "./components/UI/ErrorAlert";

const url = "http://localhost:8000/goals";

function App() {
  const [loadedGoals, setLoadedGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(function () {
    async function fetchData() {
      setIsLoading(true);

      try {
        const response = await fetch(url);

        const resData = await response.json();

        if (!response.ok) {
          throw new Error(resData.message || "Fetching the goals failed.");
        }

        setLoadedGoals(resData.goals);
      } catch (err) {
        setError(
          err.message ||
            "Fetching goals failed - the server responded with an error."
        );
      }
      setIsLoading(false);
    }

    fetchData();
  }, []);

  async function addGoalHandler(goalText) {
    setIsLoading(true);

    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ text: goalText }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || "Adding the goal failed.");
      }

      setLoadedGoals((prevGoals) => [
        { id: resData.goal.id, text: goalText },
        ...prevGoals,
      ]);
    } catch (err) {
      setError(
        err.message ||
          "Adding a goal failed - the server responded with an error."
      );
    }

    setIsLoading(false);
  }

  async function deleteGoalHandler(goalId) {
    setIsLoading(true);

    try {
      const response = await fetch(url + goalId, {
        method: "DELETE",
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || "Deleting the goal failed.");
      }

      setLoadedGoals((prevGoals) =>
        prevGoals.filter((goal) => goal.id !== goalId)
      );
    } catch (err) {
      setError(
        err.message ||
          "Deleting the goal failed - the server responded with an error."
      );
    }

    setIsLoading(false);
  }

  return (
    <div>
      {error && <ErrorAlert errorText={error} />}
      <GoalInput onAddGoal={addGoalHandler} />
      {!isLoading && (
        <CourseGoals goals={loadedGoals} onDeleteGoal={deleteGoalHandler} />
      )}
    </div>
  );
}

export default App;
