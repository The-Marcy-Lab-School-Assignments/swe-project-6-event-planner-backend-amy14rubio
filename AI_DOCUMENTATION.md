**1. What did you ask the AI to help you with, and why did you choose to use AI for that specific task?**

I asked the AI to help me debug an issue with the `rsvp` model. At first I wasn't sure which model method the issue was coming from. The problem was that when creating a new RSVP, the `listByUsers` method was not showing the new RSVP. I wasn't sure why this was happening. I thought the issue could be in either the `create` method or the `listByUsers` method.

As I checked both methods, I realized I had the inputs unordered for the `create` SQL query. In my schema design I had the values `user_id, event_id`, but in my query I was inserting `event_id, user_id`. After fixing this, I still ran into the same issue. I then deduced that my `listByUsers` query was wrong, but I wasn't sure where. I checked it line by line and changed parts of the query to debug, but I still had the same problem.

At that point, I decided to use AI to see any blind spots I might have missed. The AI showed me that I had written my `JOIN` query referencing the wrong tables. I had written `INNER JOIN users ON users.user_id = events.user_id` instead of `INNER JOIN users ON users.user_id = rsvps.user_id`. After making this fix, the `rsvp` model worked as expected.

**2. How did you evaluate whether the AI's output was correct or useful before using it?**

I evaluated whether the AI's output was correct by first trying to figure out where the bug was myself and predicting where the AI might point before submitting the prompt. After seeing the AI's response, I understood why using the wrong table in the join would cause the issue I was having. I was joining the events a user created instead of the events a user RSVP'd to, which explained why the new RSVP was not showing up.

**3. How did what the AI produced differ from what you ultimately used, and what does that tell you about your own understanding of the problem?**

What the AI produced only differed slightly from what I used. The AI recommended starting the query from the `rsvps` table, but I realized the main issue was just the join condition. I kept most of my original query and only changed what was necessary. This shows that I understood the overall structure of my query, but needed help identifying the specific mistake that was causing the issue.

**4. What did you learn from using AI in this way?**

I learned that while AI can quickly give a solution, it is important for me to understand how to debug my code and know where and why an issue happens instead of just copying the answer.
