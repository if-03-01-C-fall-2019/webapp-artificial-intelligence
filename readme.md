Web application from the Artificial Intelligence group (Kuvac, Jahn)

We planned to make a quiz, 
but not a normal quiz in which you have a page with all the quiz questions, 
instead there should be a button under each text section or chapter. 

Question button:
	This button is supposed to create a pop-up window in which it is asking specific 
	questions about the current text section with the different answer options.
 
evaluation button:
	At the end of the page there should be an evaluation button that takes you 
	to a new page with all the questions and answers you have given.
	This page also lists which answers are correct and what percentage you have achieved.
	After clicking this button, you should not be able to click it again until you reload the page. 
	Instead, the percentage of responses should appear.

Answer/Question-pool:
	In addition, all questions should be selected as far as possible from a pool of answers and so all wrong answers
	so that the same questions are not always arranged the same.

An example of this questions would be:

	Where was the term Artificial Intelligence born?

	A: Massachusetts Institute of Technology

	B: National University of Singapore
	
	C: The Dartmouth Conference

	D: Yale University

Point System:	
	If you choose the right answer you get a point, but if you choose the wrong answer you get none.
	If there are two correct answers, for example, you can only choose two. If you then choose a right 
	and a wrong one, you get one point, two right two points and two wrong no points

Server:
	we create a server on which the data of each completed quiz is stored.
	A quiz counts as completed when you click on the evaluation button which is only active when you have clicked on every question button.