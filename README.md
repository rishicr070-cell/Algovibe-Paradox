# Algovibe-Paradox
The Grand Vision (Narrative/Story)
A PEKKA is serving pancakes to her Mini PEKKA son from a towering stack on the kitchen counter. She receives a series of commands throughout breakfast: either ADD a new pancake with a specific size to the top of the stack, or SERVE the top pancake to her hungry child.

The Mini PEKKA can only ever receive whichever pancake is currently on top of the stack. Your task is to track this breakfast chaos and report which pancakes get served as the morning unfolds. If a SERVE command comes when the stack is empty, report that no pancake is available.

The Technical Challenge
Implement a stack data structure that processes ADD and SERVE commands in sequence. For each SERVE command, you must pop and return the top element.

The visualization should show pancakes stacking vertically, with the top pancake highlighted during each SERVE operation. Animate the pancake being removed and served to the Mini PEKKA.

Requirements and Constraints
First line: N (total number of commands)
Next N lines: Either 'ADD s' where s is the integer size of the pancake, or 'SERVE'
Output Format
For each SERVE command, print the size of the pancake that was served on a new line. If the stack is empty when SERVE is called, print -1.

Constraints
1 ≤ N ≤ 1,000
1 ≤ pancake size ≤ 100
Basic stack push and pop operations
