import { Suspense } from "react";
import { ContactsContent } from "./ContactsContent";

export default function ContactsPage() {
	return (
		<Suspense fallback={<div className="p-8">Loading...</div>}>
			<ContactsContent />
		</Suspense>
	);
}
