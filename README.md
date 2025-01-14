This script is intended to automate the process of assigning projects to tickets inside corporate TrackingTime.
It scans for events on the page with specific task-related note keywords and assigns them to preconfigured projects using the TrackingTime API.
Additionally, it can delete certain tasks marked for deletion, such as lunch breaks.

## Setup

1. **Include the Script:**  
   Press F12. Insert the script into a browser console or embed it into a page that contains the events you want to process.

2. **Configuration:**
    - `ENTITY_IDS_MAP`- define common project and task IDs for your entities.
    - `TASK_MAP`- map task identifiers (words) to specific project/task details. Tasks related to "Combinvest" are grouped under a nested structure for clarity.
    - `TASKS_TO_DELETE_MAP`- define tasks that should be deleted from TrackingTime (e.g., lunch breaks).

3. **API Credentials:**  
   The script uses a hardcoded authorization token. Ensure this token is valid and secure. Update the token or credentials as needed.

## Features
- Related tasks can be grouped (e.g., Combinvest-related tasks, or any other group) for more readable configuration.
- You can adjust `ENTITY_IDS_MAP`, `TASK_MAP`, and `TASKS_TO_DELETE_MAP` to suit your needs.

## How It Works

- The script flattens nested task structures using a helper function to process all tasks, including grouped ones.
- For each task defined in `TASK_MAP`, it:
    1. Searches for events on the page that contain the specified keyword.
    2. Collects matching event IDs.
    3. Constructs a payload with project and task IDs along with the event data.
    4. Sends the payload to the TrackingTime API endpoint to update events.
- For tasks listed in `TASKS_TO_DELETE_MAP`, it similarly collects matching events and issues delete requests.

## Example Usage

After configuring the script, run it on a page with TrackingTime events. The script will:
- Automatically assign projects to events that match specified task words.
- Delete events marked with words defined in `TASKS_TO_DELETE_MAP`.

Monitor the browser console for success or error messages during execution.

---

*This tool is provided as-is. Customize and extend it to fit your needs.*  
