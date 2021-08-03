Database Files
---
In our relational database there's two tables, one-to-one relationship exists when one row in a orders may be linked with only one row in paypal payments and vice versa.

## Built With
* [MySQL](https://www.mysql.com/)

## EER Diagram
<p align="center">
  <img src="EER Diagram.png"/>
</p>

Best practice to store price in database
---
For price column The best type in my my opinion should be DECIMAL(10,2). to avoid rounding errors
