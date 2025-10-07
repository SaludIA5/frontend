export default function TabButton({ activeTab, setActiveTab, label, code }: { activeTab: string, setActiveTab: (tab: string) => void, label: string, code: string }) {
  return (
    <button
      className={`flex-1 p-3 text-center border-0 rounded-none bg-white focus:outline-none focus:ring-0 ${activeTab === code ? "border-b-2 font-semibold" : "text-gray-500"}`}
      onClick={() => setActiveTab(code)}
      >
        {label}
    </button>
  );
}