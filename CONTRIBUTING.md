# CONTRIBUTORS

## Merge Requests

- Merge requests should be in `Draft` mode until they're ready to be reviewed by the team
  - Once the MR is out of Draft, its author should assume that the code may be merged into `master` once approved
  - If you would only like to have the MR reviewed but not merged by the approvers, tag the MR with `do not merge` label
- Merge requests will need to pass status checks (CI passes, upstream conflicts resolved) and be reviewed by at least one other person before merging to `master`
- In the body of your merge requests, please add a description of the changes you're introducing.

## Branching Strategy

Currently, `master` is our main development branch. Every feature should branch off of `master` and eventually merge back into `master`.

Later when we start cutting releases to environments, we'll shift to a release branch strategy.

## Code Reviews

Follow basic code review etiquette. [The below was shamelessly stolen from this website.](https://blog.codacy.com/code-review-etiquette/)

### Etiquette rules for _writing_ code

- **Code Clean and Self-Review**

  Someone is going to read what you write, so the least you can do is not make their job any harder; do read your own code before submitting it for review; make sure it does what it’s supposed to do and try to run some static analysis on it to clean up any possible problems.

- **Explain yourself**

  Most comments are either meaningless or a sign that the code could be improved, but do leave a comment explaining your algorithm or your reasoning if it took you some thought to get to your conclusions; also, fill in the description for the Pull Request, or leave a comment there if you feel that something else deserves an explanation.

- **You are not your code**

  Don’t take the comments from the reviewer personally; if someone attacks the code, don’t put yourself against them; put yourself at their side and comment the code with them; agree of disagree, but treat the code as an object, and not as an extension of yourself.

#### Etiquette rules for _reviewing_ code

- **Comment the code, not the coder**

  The focus of the code review is the code, and not its creator (if the focus happens to be its creator, then that’s not called code review anymore and you have a different problem on your hands), so watch the way you address any issue; try to refrain from expressions such as “you did this again” or “what you’re doing is wrong”; replace them with “we’ve had this problem before” or “this is not the best way to do this”.

- **Explain, don’t complain**

  Granted, if the same person makes the same mistake over and over again, this might be difficult to manage, but the truth is that it is much more effective to say “there is a better way to do this” than “this is really wrong”, even (and especially) if you really believe that it is truly wrong; while you will get your message across with the second expression, it’ll also prompt the person who wrote the code to defend it.

- **Don’t let things escalate**

  We all know that things tend to escalate too quickly; if you do find yourself exchanging too many comments and find your limits being tested, do try to have a conversation in person instead of letting those comments escalate; if you see the need for this, do it as soon as possible.
