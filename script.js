/*=============== MOBILE MENU TOGGLE ===============*/
const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => navMenu.classList.add('show-menu'));
}

if (navClose && navMenu) {
    navClose.addEventListener('click', () => navMenu.classList.remove('show-menu'));
}

document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu) navMenu.classList.remove('show-menu');
    });
});

/*=============== DYNAMIC JSON DATA RENDER ===============*/
async function loadPortfolioData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();

        // Containers
        const projContainer = document.getElementById('projects-container'); // Used on Home
        const softwareContainer = document.getElementById('software-projects-container'); // Used on Projects page
        const hardwareContainer = document.getElementById('hardware-projects-container'); // Used on Projects page
        const certContainer = document.getElementById('certificates-container');
        const modalContainer = document.getElementById('modal-container');

        let modalsHTML = '';

        // 1. Render Home Page Featured Projects (combines both or uses main list)
        if (projContainer) {
            const allProjects = [...(data.softwareProjects || []), ...(data.hardwareProjects || [])];
            const limit = projContainer.dataset.limit ? parseInt(projContainer.dataset.limit) : allProjects.length;
            const items = allProjects.slice(0, limit);

            projContainer.innerHTML = items.map(item => `
                <article class="work__card" onclick="openModal('${item.id}')" style="cursor: pointer;">
                    <img src="${item.image}" alt="${item.title}" class="work__img">
                    <h3 class="work__title">${item.title}</h3>
                    <p class="work__description">${item.description}</p>
                    <span class="work__button">View Details <i class='bx bx-right-arrow-alt work__icon'></i></span>
                </article>
            `).join('');

            items.forEach(item => modalsHTML += generateModalHTML(item, true));
        }

        // 2. Render Software Projects (on projects.html)
        if (softwareContainer && data.softwareProjects) {
            softwareContainer.innerHTML = data.softwareProjects.map(item => `
                <article class="work__card" onclick="openModal('${item.id}')" style="cursor: pointer;">
                    <img src="${item.image}" alt="${item.title}" class="work__img">
                    <h3 class="work__title">${item.title}</h3>
                    <p class="work__description">${item.description}</p>
                    <span class="work__button">View Details <i class='bx bx-right-arrow-alt work__icon'></i></span>
                </article>
            `).join('');

            data.softwareProjects.forEach(item => modalsHTML += generateModalHTML(item, true));
        }

        // 3. Render Hardware Projects (on projects.html)
        if (hardwareContainer && data.hardwareProjects) {
            hardwareContainer.innerHTML = data.hardwareProjects.map(item => `
                <article class="work__card" onclick="openModal('${item.id}')" style="cursor: pointer;">
                    <img src="${item.image}" alt="${item.title}" class="work__img">
                    <h3 class="work__title">${item.title}</h3>
                    <p class="work__description">${item.description}</p>
                    <span class="work__button">View Details <i class='bx bx-right-arrow-alt work__icon'></i></span>
                </article>
            `).join('');

            data.hardwareProjects.forEach(item => modalsHTML += generateModalHTML(item, true));
        }

        // 4. Render Certificates
        if (certContainer && data.certificates) {
            const limit = certContainer.dataset.limit ? parseInt(certContainer.dataset.limit) : data.certificates.length;
            const items = data.certificates.slice(0, limit);

            certContainer.innerHTML = items.map(item => `
                <article class="work__card" onclick="openModal('${item.id}')" style="cursor: pointer;">
                    <img src="${item.image}" alt="${item.title}" class="work__img">
                    <h3 class="work__title">${item.title}</h3>
                    <p class="work__description">${item.description}</p>
                    <span class="work__button">View Certificate <i class='bx bx-right-arrow-alt work__icon'></i></span>
                </article>
            `).join('');

            items.forEach(item => modalsHTML += generateModalHTML(item, false));
        }

        if (modalContainer) {
            modalContainer.innerHTML = modalsHTML;
        }
    } catch (err) {
        console.error('Error loading JSON portfolio data:', err);
    }
}

function generateModalHTML(item, isProject) {
    // Determine action link: GitHub for software, LinkedIn for hardware (or fallback)
    let actionButtonHTML = '';
    if (isProject) {
        if (item.github) {
            actionButtonHTML = `
                <div style="margin-top: 1.25rem;">
                    <a href="${item.github}" target="_blank" rel="noopener noreferrer" class="button">GitHub Repository</a>
                </div>
            `;
        } else if (item.linkedin) {
            actionButtonHTML = `
                <div style="margin-top: 1.25rem;">
                    <a href="${item.linkedin}" target="_blank" rel="noopener noreferrer" class="button">View on LinkedIn</a>
                </div>
            `;
        }
    }

    return `
        <div class="modal" id="${item.id}">
            <div class="modal__content">
                <span class="modal__close" onclick="closeModal('${item.id}')">&times;</span>
                <h2 class="modal__title">${item.title}</h2>
                <img src="${item.image}" class="modal__img" alt="${item.title}">
                <div class="modal__body">
                    <p>${item.fullDetails}</p>
                    ${actionButtonHTML}
                </div>
            </div>
        </div>
    `;
}

/*=============== MODAL CONTROLS ===============*/
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active-modal', 'show-modal');
        modal.style.display = 'flex';
        modal.style.opacity = '1';
        modal.style.visibility = 'visible';
        modal.style.pointerEvents = 'auto';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active-modal', 'show-modal');
        modal.style.display = 'none';
        modal.style.opacity = '0';
        modal.style.visibility = 'hidden';
        modal.style.pointerEvents = 'none';
        document.body.style.overflow = 'auto';
    }
}

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        document.querySelectorAll('.modal.active-modal, .modal.show-modal').forEach(modal => {
            closeModal(modal.id);
        });
    }
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active-modal, .modal.show-modal').forEach(modal => {
            closeModal(modal.id);
        });
    }
});

document.addEventListener('DOMContentLoaded', loadPortfolioData);