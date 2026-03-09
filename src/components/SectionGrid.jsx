import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

export default function SectionGrid({ buildings, extinguishers, onAddExtinguisher, readOnly }) {
  const navigate = useNavigate();

  const counts = (name) => {
    const list = extinguishers.filter(e => e.section === name);
    const unchecked = list.filter(e => e.status === 'pending').length;
    const checked = list.length - unchecked;
    return { total: list.length, checked, unchecked };
  };

  const handleCardClick = (e, name) => {
    if (e.target.closest('[data-add-extinguisher]')) return;
    navigate(`section/${encodeURIComponent(name)}`);
  };

  if (!buildings || buildings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-white/5 rounded-xl border border-white/10">
        <p className="text-lg text-gray-300 mb-2">No buildings yet</p>
        <p className="text-sm text-gray-400 mb-6 text-center max-w-sm">
          Add your first building to start tracking fire extinguishers.
        </p>
        {!readOnly && onAddExtinguisher && (
          <p className="text-sm text-amber-400">Use &quot;Add Building&quot; above to get started.</p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {buildings.map((b) => {
        const name = typeof b === 'string' ? b : b.name;
        const { total, checked, unchecked } = counts(name);
        return (
          <div
            key={typeof b === 'string' ? name : b.id}
            onClick={(e) => handleCardClick(e, name)}
            className="p-4 rounded-xl border bg-white shadow hover:shadow-md text-left cursor-pointer relative group"
          >
            <div className="font-semibold text-lg">{name}</div>
            <div className="mt-2 text-sm text-gray-600">Total: {total}</div>
            <div className="text-sm text-green-600">Checked: {checked}</div>
            <div className="text-sm text-amber-600">Unchecked: {unchecked}</div>
            {!readOnly && onAddExtinguisher && (
              <button
                type="button"
                data-add-extinguisher
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAddExtinguisher(name);
                }}
                className="mt-3 flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                <Plus size={16} />
                Add Extinguisher
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
