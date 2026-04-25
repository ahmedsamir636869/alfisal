import AdminSectionPage from "@/components/admin/AdminSectionPage";
import ProjectsManager from "@/components/admin/ProjectsManager";

export default function ProjectsAdmin() {
  return (
    <div>
      <AdminSectionPage
        section="projects"
        sectionTitle="Projects Page Settings"
        sectionIcon="architecture"
      />
      <ProjectsManager />
    </div>
  );
}
