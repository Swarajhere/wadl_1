async function insertData() {
  try {
    const res = await fetch('/api/insert', { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      showResult(data.message);
      showAll();
    } else {
      alert('Failed to insert data: ' + data.message);
    }
  } catch (err) {
    console.error('Insert error:', err);
    alert('Error inserting data');
  }
}

async function showAll() {
  try {
    const res = await fetch('/api/students');
    const data = await res.json();
    if (data.success) {
      document.getElementById('totalCount').textContent = data.count;
      let html = `<table>
        <tr>
          <th>Name</th>
          <th>Roll No</th>
          <th>WAD</th>
          <th>DSBDA</th>
          <th>CNS</th>
          <th>CC</th>
          <th>AI</th>
        </tr>`;
      data.students.forEach(s => {
        html += `<tr>
          <td>${s.Name}</td>
          <td>${s.Roll_No}</td>
          <td>${s.WAD_Marks}</td>
          <td>${s.DSBDA_Marks}</td>
          <td>${s.CNS_Marks}</td>
          <td>${s.CC_Marks}</td>
          <td>${s.AI_Marks}</td>
        </tr>`;
      });
      html += '</table>';
      showResult(html);
    } else {
      showResult('Failed to fetch students');
    }
  } catch (err) {
    console.error('Fetch error:', err);
    showResult('Error fetching students');
  }
}

async function showDSBDA() {
  try {
    const res = await fetch('/api/dsbda');
    const data = await res.json();
    if (data.success) {
      let html = `<table>
        <tr>
          <th>Name</th>
          <th>Roll No</th>
          <th>WAD</th>
          <th>DSBDA</th>
          <th>CNS</th>
          <th>CC</th>
          <th>AI</th>
        </tr>`;
      data.students.forEach(s => {
        html += `<tr>
          <td>${s.Name}</td>
          <td>${s.Roll_No}</td>
          <td>${s.WAD_Marks}</td>
          <td>${s.DSBDA_Marks}</td>
          <td>${s.CNS_Marks}</td>
          <td>${s.CC_Marks}</td>
          <td>${s.AI_Marks}</td>
        </tr>`;
      });
      html += '</table>';
      showResult(html);
    } else {
      showResult('Failed to fetch DSBDA students');
    }
  } catch (err) {
    console.error('DSBDA error:', err);
    showResult('Error fetching DSBDA students');
  }
}

async function showAll25() {
  try {
    const res = await fetch('/api/all25');
    const data = await res.json();
    if (data.success) {
      let html = `<table>
        <tr>
          <th>Name</th>
          <th>Roll No</th>
          <th>WAD</th>
          <th>DSBDA</th>
          <th>CNS</th>
          <th>CC</th>
          <th>AI</th>
        </tr>`;
      data.students.forEach(s => {
        html += `<tr>
          <td>${s.Name}</td>
          <td>${s.Roll_No}</td>
          <td>${s.WAD_Marks}</td>
          <td>${s.DSBDA_Marks}</td>
          <td>${s.CNS_Marks}</td>
          <td>${s.CC_Marks}</td>
          <td>${s.AI_Marks}</td>
        </tr>`;
      });
      html += '</table>';
      showResult(html);
    } else {
      showResult('Failed to fetch all25 students');
    }
  } catch (err) {
    console.error('All25 error:', err);
    showResult('Error fetching all25 students');
  }
}

async function showLowMarks() {
  try {
    const res = await fetch('/api/lowmarks');
    const data = await res.json();
    if (data.success) {
      let html = `<table>
        <tr>
          <th>Name</th>
          <th>Roll No</th>
          <th>WAD</th>
          <th>DSBDA</th>
          <th>CNS</th>
          <th>CC</th>
          <th>AI</th>
        </tr>`;
      data.students.forEach(s => {
        html += `<tr>
          <td>${s.Name}</td>
          <td>${s.Roll_No}</td>
          <td>${s.WAD_Marks}</td>
          <td>${s.DSBDA_Marks}</td>
          <td>${s.CNS_Marks}</td>
          <td>${s.CC_Marks}</td>
          <td>${s.AI_Marks}</td>
        </tr>`;
      });
      html += '</table>';
      showResult(html);
    } else {
      showResult('Failed to fetch lowmarks students');
    }
  } catch (err) {
    console.error('Lowmarks error:', err);
    showResult('Error fetching lowmarks students');
  }
}

async function updateMarks() {
  const roll = document.getElementById('rollNo').value;
  if (!roll) return alert('Please enter a Roll No');
  try {
    const res = await fetch(`/api/update/${roll}`, { method: 'PUT' });
    const data = await res.json();
    if (data.success) {
      showResult('Marks updated');
      showAll();
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error('Update error:', err);
    alert('Error updating marks');
  }
}

async function deleteStudent() {
  const roll = document.getElementById('rollNo').value;
  if (!roll) return alert('Please enter a Roll No');
  try {
    const res = await fetch(`/api/delete/${roll}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      showResult('Student deleted');
      showAll();
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error('Delete error:', err);
    alert('Error deleting student');
  }
}

function showResult(content) {
  document.getElementById('result').innerHTML = content;
}