/* =============================================
   projects.js — Projects Gallery Filtering
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const currentCountEl = document.getElementById('current-count');

    const updateFilters = (filter) => {
        let visibleCount = 0;
        projectCards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.style.display = 'flex';
                setTimeout(() => {
                    card.classList.add('visible');
                }, 10);
                visibleCount++;
            } else {
                card.style.display = 'none';
                card.classList.remove('visible');
            }
        });
        currentCountEl.textContent = visibleCount;
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateFilters(btn.dataset.filter);
        });
    });

    // Run once on load
    updateFilters('all');

    // Load More placeholder logic
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            loadMoreBtn.innerHTML = 'Loading...';
            loadMoreBtn.disabled = true;

            setTimeout(() => {
                loadMoreBtn.innerHTML = 'No more projects to load';
                loadMoreBtn.classList.add('disabled');
            }, 1000);
        });
    }
});
