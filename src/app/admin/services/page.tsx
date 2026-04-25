import AdminSectionPage from "@/components/admin/AdminSectionPage";
import ServicesManager from "@/components/admin/ServicesManager";

export default function ServicesAdmin() {
  return (
    <div>
      <AdminSectionPage
        section="services"
        sectionTitle="Services Page Settings"
        sectionIcon="handyman"
      />
      <ServicesManager />
    </div>
  );
}
