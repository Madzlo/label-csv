
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { useRouter } from "next/router";

const USERS = {
  Profi: "asdj#aslkdj!123ks",
  Profi2: "asdj#aslkdj!123ks",
  Profi3: "asdj#aslkdj!123ks",
  Profi4: "asdj#aslkdj!123ks",
};

export default function Home() {
  const [csvUrl, setCsvUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("auth_user");
    if (!user || !USERS[user]) {
      router.push("/login");
    }
  }, []);

  const generatePhone = () => {
    return `${Math.floor(200 + Math.random() * 800)}-${200 + Math.floor(Math.random() * 800)}-${1000 + Math.floor(Math.random() * 9000)}`;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async (evt) => {
      setLoading(true);
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const header = [
        "ServiceName", "FromSenderName", "FromPhone", "FromCompany", "FromStreet1", "FromStreet2",
        "FromCity", "FromStateProvince", "FromZipPostal", "FromCountry", "ToRecipientName",
        "ToPhone", "ToCompany", "ToStreet1", "ToStreet2", "ToCity", "ToStateProvince", "ToZipPostal",
        "ToCountry", "PackageLength", "PackageWidth", "PackageHeight", "PackageWeight",
        "PackageDescription", "PackageReference1", "PackageReference2"
      ];

      const rows = [];

      for (const row of data.slice(1)) {
        const toName = row[1];
        const toAddress = row[2] || "";
        const fromName = row[7];
        const fromAddress = row[8] || "";

        rows.push([
          "USPS Express",             // ServiceName
          fromName,                  // FromSenderName
          generatePhone(),           // FromPhone
          "",                        // FromCompany
          fromAddress,               // FromStreet1
          "", "", "", "", "US",      // FromStreet2 ... FromCountry
          toName,                    // ToRecipientName
          generatePhone(),           // ToPhone
          "",                        // ToCompany
          toAddress,                 // ToStreet1
          "", "", "", "", "US",      // ToStreet2 ... ToCountry
          5, 7, 1, 1,                // Dimensions + Weight
          "", "", ""                 // PackageDescription ...
        ]);
      }

      const csvContent = [header, ...rows]
        .map((e) => e.map((v) => `"${v ?? ""}"`).join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      setCsvUrl(url);
      setLoading(false);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Генератор CSV по шаблону (без парсинга)</h1>
      <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} />
      {loading && <p>⏳ Обработка...</p>}
      {csvUrl && (
        <a href={csvUrl} download="shipments.csv">
          <button>Скачать CSV</button>
        </a>
      )}
    </div>
  );
}
