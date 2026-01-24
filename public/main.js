const API_BASE = '/api/appointments';

const form = document.getElementById('appointment-form');
const idInput = document.getElementById('appointment-id');
const patientInput = document.getElementById('patientName');
const doctorInput = document.getElementById('doctorName');
const dateInput = document.getElementById('date');
const cancelEditBtn = document.getElementById('cancel-edit');
const tableBody = document.querySelector('#appointments-table tbody');
const emptyMessage = document.getElementById('empty-message');

let isEditing = false;

async function loadAppointments() {
  const res = await fetch(API_BASE);
  const data = await res.json();
  renderTable(data);
}

function renderTable(items) {
  tableBody.innerHTML = '';

  if (!items.length) {
    emptyMessage.style.display = 'block';
    return;
  }
  emptyMessage.style.display = 'none';

  items.forEach((item) => {
    const tr = document.createElement('tr');

    const tdPatient = document.createElement('td');
    tdPatient.textContent = item.patientName;

    const tdDoctor = document.createElement('td');
    tdDoctor.textContent = item.doctorName;

    const tdDate = document.createElement('td');
    tdDate.textContent = item.date;

    const tdActions = document.createElement('td');
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'btn small';
    editBtn.addEventListener('click', () => startEdit(item));

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.className = 'btn small danger';
    delBtn.addEventListener('click', () => deleteAppointment(item._id));

    tdActions.appendChild(editBtn);
    tdActions.appendChild(delBtn);

    tr.appendChild(tdPatient);
    tr.appendChild(tdDoctor);
    tr.appendChild(tdDate);
    tr.appendChild(tdActions);

    tableBody.appendChild(tr);
  });
}

function resetForm() {
  isEditing = false;
  idInput.value = '';
  patientInput.value = '';
  doctorInput.value = '';
  dateInput.value = '';
  cancelEditBtn.classList.add('hidden');
}

function startEdit(item) {
  isEditing = true;
  idInput.value = item._id;
  patientInput.value = item.patientName;
  doctorInput.value = item.doctorName;
  dateInput.value = item.date;
  cancelEditBtn.classList.remove('hidden');
}

cancelEditBtn.addEventListener('click', () => {
  resetForm();
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const body = {
    patientName: patientInput.value.trim(),
    doctorName: doctorInput.value.trim(),
    date: dateInput.value
  };

  if (!body.patientName || !body.doctorName || !body.date) {
    alert('All fields are required');
    return;
  }

  try {
    if (isEditing && idInput.value) {
      // UPDATE
      const res = await fetch(`${API_BASE}/${idInput.value}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert('Update failed: ' + (err.error || res.status));
      }
    } else {
      // CREATE
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.status !== 201) {
        const err = await res.json().catch(() => ({}));
        alert('Create failed: ' + (err.error || res.status));
      }
    }

    resetForm();
    await loadAppointments();
  } catch (err) {
    console.error(err);
    alert('Network error');
  }
});

async function deleteAppointment(id) {
  if (!confirm('Delete this appointment?')) return;

  try {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert('Delete failed: ' + (err.error || res.status));
    } else {
      await loadAppointments();
    }
  } catch (err) {
    console.error(err);
    alert('Network error');
  }
}

document.addEventListener('DOMContentLoaded', loadAppointments);
