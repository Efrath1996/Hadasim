
CREATE TABLE Person (
    Person_Id INT PRIMARY KEY,
    First_Name VARCHAR(50),
    Last_Name VARCHAR(50),
    Gender VARCHAR(10),
    Father_Id INT,
    Mother_Id INT,
    Spouse_Id INT,
    FOREIGN KEY (Father_Id) REFERENCES Person(Person_Id),
    FOREIGN KEY (Mother_Id) REFERENCES Person(Person_Id),
    FOREIGN KEY (Spouse_Id) REFERENCES Person(Person_Id)
);


INSERT INTO Person (Person_Id, First_Name, Last_Name, Gender, Father_Id, Mother_Id, Spouse_Id)
VALUES (1, 'Ilan', 'Hadad', 'Male', NULL, NULL, 2);

INSERT INTO Person (Person_Id, First_Name, Last_Name, Gender, Father_Id, Mother_Id, Spouse_Id)
VALUES (2, 'Orly', 'Hadad', 'Female', NULL, NULL, 1);

INSERT INTO Person (Person_Id, First_Name, Last_Name, Gender, Father_Id, Mother_Id, Spouse_Id)
VALUES (3, 'Shmuel', 'Levi', 'Male', NULL, NULL, NULL);

INSERT INTO Person (Person_Id, First_Name, Last_Name, Gender, Father_Id, Mother_Id, Spouse_Id)
VALUES (4, 'Tamar', 'Levi', 'Female', 1, 2, 3);

INSERT INTO Person (Person_Id, First_Name, Last_Name, Gender, Father_Id, Mother_Id, Spouse_Id)
VALUES (5, 'Lior', 'Rahmimov', 'Male', NULL, NULL, NULL);

INSERT INTO Person (Person_Id, First_Name, Last_Name, Gender, Father_Id, Mother_Id, Spouse_Id)
VALUES (6, 'Efrat', 'Rahmimov', 'Female', 1, 2, 5);


CREATE TABLE FamilyRelations (
    Person_Id INT,
    Relative_Id INT,
    Connection_Type VARCHAR(20)
);

INSERT INTO FamilyRelations (Person_Id, Relative_Id, Connection_Type)
SELECT Person_Id, Father_Id, 'Father'
FROM Person
WHERE Father_Id IS NOT NULL;

INSERT INTO FamilyRelations (Person_Id, Relative_Id, Connection_Type)
SELECT Person_Id, Mother_Id, 'Mother'
FROM Person
WHERE Mother_Id IS NOT NULL;

INSERT INTO FamilyRelations (Person_Id, Relative_Id, Connection_Type)
SELECT Person_Id, Spouse_Id,
       CASE Gender
         WHEN 'Male' THEN 'Wife'
         WHEN 'Female' THEN 'Husband'
       END AS Connection_Type
FROM Person
WHERE Spouse_Id IS NOT NULL;

INSERT INTO FamilyRelations (Person_Id, Relative_Id, Connection_Type)
SELECT Father_Id, Person_Id,
       CASE Gender
         WHEN 'Male' THEN 'Son'
         WHEN 'Female' THEN 'Daughter'
       END AS Connection_Type
FROM Person
WHERE Father_Id IS NOT NULL;

INSERT INTO FamilyRelations (Person_Id, Relative_Id, Connection_Type)
SELECT Mother_Id, Person_Id,
       CASE Gender
         WHEN 'Male' THEN 'Son'
         WHEN 'Female' THEN 'Daughter'
       END AS Connection_Type
FROM Person
WHERE Mother_Id IS NOT NULL;


INSERT INTO FamilyRelations (Person_Id, Relative_Id, Connection_Type)
SELECT a.Person_Id, b.Person_Id,
       CASE b.Gender
         WHEN 'Male' THEN 'Brother'
         WHEN 'Female' THEN 'Sister'
       END AS Connection_Type
FROM Person AS a
JOIN Person AS b
  ON a.Person_Id <> b.Person_Id
 AND (
       (a.Father_Id IS NOT NULL AND a.Father_Id = b.Father_Id)
    OR (a.Mother_Id IS NOT NULL AND a.Mother_Id = b.Mother_Id)
 );


UPDATE Person
SET Spouse_Id = (
  SELECT a.Person_Id
  FROM Person a
  WHERE a.Spouse_Id = Person.Person_Id
  LIMIT 1
)
WHERE Spouse_Id IS NULL;