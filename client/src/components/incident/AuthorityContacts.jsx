export const AuthorityContacts = ({ contacts = [] }) => (
  <div className="rounded-xl border border-amber-100 bg-amber-50 p-5">
    <h2 className="font-medium text-amber-950">Specialized rescue contacts</h2>
    <p className="mt-2 text-sm text-amber-800">For dangerous, protected, or high-risk animals, keep distance and contact an authorized rescue team.</p>
    <div className="mt-4 grid gap-3">
      {contacts.map((contact) => (
        <div key={`${contact.name}-${contact.phone}`} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white p-3">
          <div>
            <p className="text-sm font-medium text-gray-950">{contact.name}</p>
            <p className="text-xs capitalize text-gray-500">{contact.type} - {contact.coverage}</p>
          </div>
          <a href={`tel:${contact.phone}`} className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white">
            Call {contact.phone}
          </a>
        </div>
      ))}
    </div>
  </div>
);
