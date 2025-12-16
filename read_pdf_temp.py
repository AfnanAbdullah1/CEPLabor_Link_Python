import sys

pdf_path = r"d:/IUB_Data/5th Sem/Python/Project/labor-link-app/CEP_Python_Guidelines.pdf"

try:
    import pypdf
    print("Using pypdf")
    reader = pypdf.PdfReader(pdf_path)
    for page in reader.pages:
        print(page.extract_text())
except ImportError:
    try:
        import PyPDF2
        print("Using PyPDF2")
        reader = PyPDF2.PdfFileReader(pdf_path)
        for page_num in range(reader.numPages):
            print(reader.getPage(page_num).extractText())
    except ImportError:
        print("PDF library not found. Please install pypdf or PyPDF2.")
