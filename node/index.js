const express = require('express')
const mysql = require('mysql');
const app = express()
const port = 3000

const config = {
  host: 'db',
  user: 'root',
  password: 'password',
  database: 'nodedb',
};




app.get('/', (req, res) => {
  insertPeople(res)
})

app.listen(port, () => {
  console.log('Rodando na porta ' + port)
})


const names = ['Alice', 'Bob', 'Charlie', 'Dave', 'Eve', 'Frank', 'Grace', 'Hannah', 'Ivy', 'John'];

const generateRandomName = () => {
    const randomIndex = Math.floor(Math.random() * names.length);
    const randomName = names[randomIndex];

    return randomName
}

const insertPeople = async (res) => {
  const connection = mysql.createConnection(config);
  const sql = `INSERT INTO people(name) values('${generateRandomName()}')`;
  connection.query(sql);

  getPeople(res, connection)
}

const getPeople = (res, connection) => {
  const sql = `SELECT id, name FROM people`;  
  
  connection.query(sql, (error, results, fields) => {
      if (error) {
          throw error;
      }
      
      let html = '<!DOCTYPE html><html lang="en"><head>';
      html += '<meta charset="UTF-8"><title>People List</title>';
      
      // Adicionando estilos CSS para a tabela
      html += '<style>';
      html += '  table { width: 80%; margin: 50px auto; border-collapse: collapse; }';
      html += '  th, td { padding: 10px; text-align: center; border-bottom: 1px solid #ddd; }';
      html += '  th { background-color: #f2f2f2; }';
      html += '  tr:nth-child(even) { background-color: #f2f2f2; }';
      html += '  tr:hover { background-color: #ddd; }';
      html += '</style>';
      
      html += '</head><body>';
      
      html += '<h1 style="text-align: center;">Full Cycle Rocks!</h1>';
      
      // Construindo a tabela
      let table = '<table>';
      table += '<tr><th>#</th><th>Name</th></tr>';
      for(let people of results) {      
          table += `<tr><td>${people.id}</td><td>${people.name}</td></tr>`;
      }
      table += '</table>';    
      
      html += table + '</body></html>';
      
      res.send(html);    
  });   

  connection.end();
}