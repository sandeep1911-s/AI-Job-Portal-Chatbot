const { Job, User, Application } = require('./models');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'ai_job_portal_secret_key_2026';

async function verifyLogic() {
    try {
        console.log("Starting verification...");

        // Mock a request with user ID 2 (Sandeep S)
        const userId = 2;

        console.log("1. Finding applications for user ID:", userId);
        const applications = await Application.findAll({
            where: { user_id: userId },
            attributes: ['job_id']
        });
        const appliedJobIds = applications.map(a => a.job_id);
        console.log("Applied Job IDs found:", appliedJobIds);

        console.log("2. Fetching active jobs...");
        const jobs = await Job.findAll({
            where: { is_active: true }
        });

        console.log("3. Mapping jobs with is_applied flag...");
        const result = jobs.map(j => {
            const isApplied = appliedJobIds.includes(j.id);
            console.log(`Job ID ${j.id} (${j.title}): isApplied = ${isApplied}`);
            return {
                id: j.id,
                title: j.title,
                is_applied: isApplied
            };
        });

        const targetJob = result.find(j => j.id === 1);
        if (targetJob && targetJob.is_applied) {
            console.log("\n✅ SUCCESS: logic works correctly.");
        } else {
            console.log("\n❌ FAILURE: logic failed to identify applied job.");
        }

        process.exit(0);
    } catch (err) {
        console.error("Verification error:", err);
        process.exit(1);
    }
}

verifyLogic();
