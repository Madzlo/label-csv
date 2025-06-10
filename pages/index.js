
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
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("auth_user");
    if (!user || !USERS[user]) {
      router.push("/login");
    }
  }, []);

  const parseAddress = (fullAddress) => {
    const [street, cityStateZip] = fullAddress.split("\n");
    if (!street || !cityStateZip) return {};

    const [cityState, zip] = cityStateZip.split(",").map((s) => s.trim());
    const [city, state] = cityState.split(" ");

    return {
      street,
      city,
      state,
      zip,
      country: "US",
    };
  };

  const generatePhone = () => {
    return \`\${Math.floor(200 + Math.random() * 800)}-\${200 + Math.floor(Math.random() * 800)}-\${1000 + Math.floor(Math.random() * 9000)}\`;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
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

      const rows = data.slice(1).map((row) => {
        const toName = row[1];
        const toAddress = parseAddress(row[2] || "");
        const fromName = row[7];
        const fromAddress = parseAddress(row[8] || "");
        const useAltSize = Math.random() < 0.5;
        const [length, width, height] = useAltSize ? [5, 7, 1] : [1, 2, 4];

        return [
          "USPS Express",
          fromName,
          generatePhone(),
          "",
          fromAddress.street,
          "",
          fromAddress.city,
          fromAddress.state,
          fromAddress.zip,
          "US",
          toName,
          generatePhone(),
          "",
          toAddress.street,
          "",
          toAddress.city,
          toAddress.state,
          toAddress.zip,
          "US",
          length,
          width,
          height,
          1,
          "",
          "",
          ""
        ];
      });

      const csvContent = [header, ...rows]
        .map((e) => e.map((v) => `"\${v ?? ""}"`).join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      setCsvUrl(url);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Генератор лейблов CSV</h1>
      <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} />
      {csvUrl && (
        <a href={csvUrl} download="shipments.csv">
          <button>Скачать CSV</button>
        </a>
      )}
    </div>
  );
}
