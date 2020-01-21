Code review of Master branch.
1. What is done well?
	-- > NX, NGRX and Façade pattern
    --> having components in lib makes application much more modular and can be used in other applications. 
    --> using Hapi server 
2. What would you change?
    --> implement Ondestroy method to unsubscribe observables or use async.  
--> Would avoid using any. And make objects Strongly Typed whenever possible. 
--> would avoid createComponent test case

	3. Are there any code smells or problematic implementations?
--> In chat component, ngIf was binding to a value which wasn't in component's scope. Fixed in the task. 
    --> code wasn't saving symbol in store. Committed that change in task.
    --> In Chart component Subscribe is used but unsubscribe is not used which leads to memory leak issue. Fixed in the task
--> Would remove the unused imports from the projects. 
--> Use explicit changedetection stratogies. 
  --> test cases failing in master branch. 
