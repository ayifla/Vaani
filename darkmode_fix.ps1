$path = 'C:\Users\User\Desktop\SignaAI_repo\frontend\src\components\SignWorkspace.tsx'
$c = Get-Content -Raw $path

$c = $c.Replace('bg-white', 'bg-white dark:bg-[#15221C]')
$c = $c.Replace('border-[#E3DAC9]', 'border-[#E3DAC9] dark:border-[#283D33]')
$c = $c.Replace('text-[#1E3A2B]', 'text-[#1E3A2B] dark:text-[#EDE8E1]')
$c = $c.Replace('text-[#72786F]', 'text-[#72786F] dark:text-[#9BB0A4]')
$c = $c.Replace('bg-[#F2ECE1]', 'bg-[#F2ECE1] dark:bg-[#1B2C24]')
$c = $c.Replace('text-[#9DA39A]', 'text-[#9DA39A] dark:text-[#6B7A70]')
$c = $c.Replace('bg-[#FDFBF7]', 'bg-[#FDFBF7] dark:bg-[#1B2C24]')
$c = $c.Replace('border-[#F2ECE1]', 'border-[#F2ECE1] dark:border-[#283D33]')
$c = $c.Replace('bg-[#F8F5EE]', 'bg-[#F8F5EE] dark:bg-[#0E1612]')
$c = $c.Replace('text-[#343832]', 'text-[#343832] dark:text-[#EDE8E1]')

Set-Content -NoNewline $path $c
Write-Host "Done - dark mode classes added"