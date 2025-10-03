export default function TabButton({ activeTab, setActiveTab, label, code }: { activeTab: string, setActiveTab: (tab: string) => void, label: string, code: string }) {
  return (
    <button
      className={`flex-1 p-3 text-center ${activeTab === code ? "border-b-2 border-blue-600 font-semibold" : "text-gray-500"}`}
      onClick={() => setActiveTab(code)}
    >
      {label}
    </button>
  );
}