import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        projectName: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        technologies: [
            {
                type: String,
            },
        ],

        // Personal or Client Project
        projectCategory: {
            type: String,
            required: true,
            enum: ["Personal", "Client"],
        },

        // Project Type
        projectType: {
            type: String,
            enum: [
                "Full Stack",
                "Frontend",
                "Backend",
                "ERP",
                "CRM",
                "E-Commerce",
                "Dashboard",
                "Portfolio",
                "Landing Page",
                "Mobile App",
                "Other"
            ],
            required: true,
        },

        order: {
            type: Number,
            default: 0,
        },

        // Website URL
        liveUrl: {
            type: String,
            default: "",
        },

        // GitHub Repository
        githubUrl: {
            type: String,
            default: "",
        },

        desktopImage: {
            url: {
                type: String,
                required: true,
            },
            public_id: {
                type: String,
                required: true,
            },
        },

        mobileImage: {
            url: {
                type: String,
                required: true,
            },
            public_id: {
                type: String,
                required: true,
            },
        },

        clientLogo: {
            url: String,
            public_id: String,
        },

        // Client Information
        clientName: {
            type: String,
            default: "",
        },

        clientCity: {
            type: String,
            default: "",
        },

        featured: {
            type: Boolean,
            default: false,
        },

        status: {
            type: String,
            enum: ["Completed", "In Progress"],
            default: "Completed",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Project", projectSchema);