// admin.js

// 1. SECURITY CHECK: Kick user out if not logged in as admin
checkAuth('admin');

document.addEventListener('DOMContentLoaded', async () => {
    await renderAdminView();
});

async function renderAdminView() {
    const issues = await getIssues();
    
    // UPDATE STATS
    document.getElementById('count-total').innerText = issues.length;
    document.getElementById('count-pending').innerText = issues.filter(i => i.status === 'Pending').length;
    document.getElementById('count-resolved').innerText = issues.filter(i => i.status === 'Resolved').length;

    const container = document.getElementById('admin-list');
    container.innerHTML = '';

    if (issues.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:gray;">No issues reported yet.</p>';
        return;
    }

    issues.forEach(issue => {
        let actionHTML = '';
        
        // IF PENDING: Show Input for "Proof Photo" and Resolve Button
        if (issue.status === 'Pending') {
            actionHTML = `
                <div style="background:#f7fafc; padding:10px; border-radius:5px; margin-top:10px; border:1px dashed #cbd5e0;">
                    <p style="font-size:0.9rem; margin:0 0 5px 0;"><strong>Action Required:</strong> Upload Proof of Resolution</p>
                    <input type="file" id="proof-${issue.id}" accept="image/*" style="font-size:0.8rem;">
                    <button class="btn-primary" style="background:#48bb78; margin-top:5px;" 
                        onclick="handleResolve(${issue.id})">
                        Mark Resolved & Upload Proof ✅
                    </button>
                </div>
            `;
        } else {
            // IF RESOLVED: Show Success Message
            actionHTML = `
                <div style="margin-top:10px; color:#2f855a; background:#f0fff4; padding:5px; border-radius:4px; font-weight:bold; text-align:center;">
                    ✅ Issue Resolved
                </div>
            `;
        }

        const html = `
            <div class="card">
                <div style="display:flex; justify-content:space-between;">
                    <h4>${issue.title}</h4>
                    <span style="font-size:0.8rem; color:gray;">ID: ${issue.id}</span>
                </div>
                
                ${issue.student_image ? `<img src="${issue.student_image}" style="max-height:200px; object-fit:cover;">` : ''}
                
                ${actionHTML}
            </div>
        `;
        container.innerHTML += html;
    });
}

// 2. HANDLE RESOLVE
async function handleResolve(id) {
    // Get the specific file input for this card using the ID
    const fileInput = document.getElementById(`proof-${id}`);
    
    // Validation: Admin MUST upload a photo
    if (!fileInput.files[0]) {
        return alert("⚠️ You cannot mark an issue as resolved without uploading a proof photo!");
    }

    const reader = new FileReader();
    reader.onloadend = async function() {
        const adminImageBase64 = reader.result;
        
        // Call the database bridge
        const res = await resolveIssueInDB(id, adminImageBase64);
        
        if (res.success) {
            alert("Issue marked as Resolved!");
            renderAdminView(); // Refresh the dashboard
        }
    };

    reader.readAsDataURL(fileInput.files[0]);
}